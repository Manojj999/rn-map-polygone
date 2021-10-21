import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  MAP_TYPES,
  Polygon,
  Marker,
} from 'react-native-maps';
import _ from 'lodash';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as geolib from 'geolib';
import Geolocation from '@react-native-community/geolocation';

import {PolygonList} from './PolygonList';
import CalculationModal from './components/CalculationModal';
import PolygonNameModal from './components/PolygonNameModal';
import {
  CircleIcon,
  TrashIcon,
  UndoIcon,
  ListIcon,
  AreaIcon,
  PerimeterIcon,
  SaveIcon,
} from './assets/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const LATITUDE_DELTA = 25;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const PolygonOnMap = () => {
  let LATITUDE = 21.233594;
  let LONGITUDE = 72.855178;

  const [initialRegion, setInitialRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [id, setId] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [markerIndex, setMarkerIndex] = useState(null);
  const [showUndoIcon, setShowUndoIcon] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [polygoneName, setPolygoneName] = useState('');
  const [area, setArea] = useState(0);
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [perimeter, setPerimeter] = useState(0);
  const [isPerimeterModalVisible, setIsPerimeterModalVisible] = useState(false);
  const [showPolymodalVisible, setPolyModalVisible] = useState(false);
  const [polyData, setPolyData] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else if (Platform.OS === 'ios') {
      getCurrentLatlong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('polygon NAmeee', polygoneName);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This App needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLatlong();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getCurrentLatlong = () => {
    Geolocation.getCurrentPosition(info => {
      setInitialRegion({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    });
  };

  const calculateArea = useCallback(
    coords => {
      let y = coords.map(({latitude, longitude}) => [latitude, longitude]);
      let totalArea = geolib.getAreaOfPolygon(y);
      setArea(totalArea);
    },
    [area],
  );

  const haversine = (coords1, coords2) => {
    const R = 6371e3; // metres
    const φ1 = (coords1.latitude * Math.PI) / 180; // φ, λ in radians
    const φ2 = (coords2.latitude * Math.PI) / 180;
    const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
    const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  const calculatePerimeter = useCallback(
    coords => {
      const reducer = (accumulator, curr) => accumulator + curr;
      let temparr = [];
      coords
        .map(item => item)
        .sort((coords1, coords2) => {
          const number = haversine(coords1, coords2);
          temparr.push(number);
        });
      const sum = temparr.reduce(reducer);
      setPerimeter(sum);
    },
    [perimeter],
  );

  const onPressMap = e => {
    const newPoint = e.nativeEvent.coordinate;
    let points = [];
    if (coordinates.length > 0) {
      const lastPoint = _.last(coordinates);
      const middlePoint = geolib.getCenter([lastPoint, newPoint]);
      points = [...coordinates, middlePoint, newPoint];
    } else {
      points = [...coordinates, newPoint];
    }
    setId(prevId => prevId++);
    setCoordinates(points);
    setShowUndoIcon(true);
    setShowDeleteIcon(true);
  };
  const markerDrag = e => {
    const newPoint = e.nativeEvent.coordinate;
    if (coordinates.length > 1) {
      let dragPoints = coordinates.slice(0);
      dragPoints[markerIndex] = newPoint;
      setId(prevId => prevId++);
      setCoordinates(dragPoints);
    } else {
      setId(prevId => prevId++);
      setCoordinates([newPoint]);
    }
  };
  const markerStartPress = m => {
    const index = coordinates.indexOf(m);
    setMarkerIndex(index);
  };

  const mapOptions = {
    scrollEnabled: true,
  };
  if (editing) {
    mapOptions.scrollEnabled = false;
    mapOptions.onPanDrag = e => onPressMap(e);
  }

  const selectUndo = () => {
    let coordinatesLenght = coordinates.length;
    if (coordinatesLenght > 1) {
      let undoCoordinates = coordinates.slice(0, coordinatesLenght - 1);
      setCoordinates(undoCoordinates);
    } else {
      setCoordinates([]);
      setShowUndoIcon(false);
      setShowDeleteIcon(false);
    }
  };
  const pressDeletePolygon = () => {
    setShowDeleteIcon(false);
    setCoordinates([]);
    setShowUndoIcon(false);
  };

  const handleSaveClick = () => {
    if (coordinates.length < 2) {
      Alert.alert('Please draw a polygon');
    } else {
      calculateArea(coordinates);
      calculatePerimeter(coordinates);
      setModalVisible(!modalVisible);
    }
  };
  const handleAreaClick = () => {
    if (coordinates.length < 2) {
      Alert.alert('Please draw a polygon');
    } else {
      calculateArea(coordinates);
      setIsAreaModalVisible(true);
    }
  };
  const handlePerimeterClick = () => {
    if (coordinates.length < 2) {
      Alert.alert('Please draw a polygon');
    } else {
      calculatePerimeter(coordinates);
      setIsPerimeterModalVisible(true);
    }
  };

  const onSaveDataClick = () => {
    if (polygoneName.length > 0) {
      setModalVisible(!modalVisible);
    } else {
      Alert.alert('Please enter polygon name');
    }

    let data = {
      polyName: polygoneName,
      area,
      perimeter,
    };

    let polydata = [...polyData, data];

    setPolyData(polydata);
    setPolygoneName('');
    setCoordinates([]);
  };

  return showPolymodalVisible ? (
    <PolygonList
      polygonListModal={showPolymodalVisible}
      setPolygonListModal={setPolyModalVisible}
      PolygonData={polyData}
    />
  ) : (
    <View style={styles.container}>
      {isAreaModalVisible ? (
        <CalculationModal
          isVisible={isAreaModalVisible}
          setIsVisible={setIsAreaModalVisible}
          param={area}
          paramName="Area"
        />
      ) : isPerimeterModalVisible ? (
        <CalculationModal
          isVisible={isPerimeterModalVisible}
          setIsVisible={setIsPerimeterModalVisible}
          param={perimeter}
          paramName="Perimeter"
        />
      ) : null}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        mapType={MAP_TYPES.STANDARD}
        showsCompass={true}
        zoomControlEnabled={true}
        onPress={e => onPressMap(e)}
        {...mapOptions}>
        {coordinates.length > 0 && (
          <Polygon
            key={id}
            coordinates={coordinates}
            fillColor="rgba(89,128,24, 0.1)"
            strokeColor="#ed5858"
          />
        )}
        {coordinates.length > 0 &&
          coordinates.map((m, i) => (
            <Marker
              draggable
              onDrag={e => markerDrag(e)}
              onDragStart={() => markerStartPress(m)}
              key={i}
              coordinate={m}>
              <CircleIcon />
            </Marker>
          ))}
      </MapView>

      <PolygonNameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        polygoneName={polygoneName}
        setPolygoneName={setPolygoneName}
        onPress={() => {
          onSaveDataClick();
        }}
      />

      <View style={styles.calculate}>
        <TouchableOpacity
          onPress={() => setPolyModalVisible(true)}
          style={[styles.selectButton]}>
          <ListIcon />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAreaClick}
          style={[styles.selectButton]}>
          <AreaIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePerimeterClick}
          style={[styles.selectButton]}>
          <PerimeterIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveClick}
          style={[styles.selectButton]}>
          <SaveIcon />
        </TouchableOpacity>

        {showUndoIcon && (
          <TouchableOpacity onPress={selectUndo} style={[styles.selectButton]}>
            <UndoIcon />
          </TouchableOpacity>
        )}
        {showDeleteIcon && (
          <TouchableOpacity
            onPress={pressDeletePolygon}
            style={[styles.selectDeleteButton]}>
            <TrashIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    marginLeft: 1,
  },
  calculate: {
    position: 'absolute',
    bottom: 17,
    zIndex: 1,
    left: wp('0%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectUndoContainer: {
    position: 'absolute',
    bottom: 17,
    left: wp('44%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 10,
    padding: 10,
    // width: wp('20%'),
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255, 0.9)',
    marginLeft: 5,
  },
  selectUndoText: {
    textAlign: 'center',
    fontFamily: 'Vazir',
    color: 'rgba(49,56,51, 0.5)',
  },
  selectDeleteContainer: {
    position: 'absolute',
    bottom: 17,
    left: wp('65%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  selectDeleteButton: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,

    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255, 0.9)',
    marginLeft: 5,
  },
  selectDeleteText: {
    textAlign: 'center',
    fontFamily: 'Vazir',
    color: 'rgba(49,56,51, 0.5)',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 15,
    width: '50%',
  },

  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'flex-start',
  },
});
export default PolygonOnMap;
