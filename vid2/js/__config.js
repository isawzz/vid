var USERNAME = 'felix';
var GAMEPLID=null;
const USERNAME_ORIG = USERNAME;
var GAME = 'catan'; // catan | aristocracy | ttt | game01
var PLAYMODE = 'hotseat'; // multiplayer | hotseat | solo | passplay
var SEED = 1;

const USE_MAX_PLAYER_NUM = true; // true | false
const TIMIT_SHOW = false; // true | false
const SHOW_SERVER_ROUTE = false; // true | false
const SHOW_SERVER_RETURN = false; // true | false
const SHOW_SPEC_CODE_DATA = false; // true | false

//when testing, uses files in tests/GAME/uspecN and codeN
const RUNTEST = false; // true | false
const TESTING = true; // true | false
const TEST_PATH = '/vid2/tests/';
const DSPEC_VERSION = 2;
const USPEC_VERSION = 1;
const CODE_VERSION = 1;
const DATA_VERSION = 1;

//used when NOT testing:
var VERSION = '_02'; //files sollen heissen [GAME]_01.yaml and [GAME]_01.js, und im richtigen dir sein!!
var CACHE_DEFAULTSPEC = false;
var CACHE_USERSPEC = false;
var CACHE_CODE = false;
var CACHE_INITDATA = false;
const USE_ALL_GAMES_ROUTE = false; // true | false //false means directly loading game infos from info.yaml

var SPEC = null; //merged userSpec and defaultSpec

var autoplayFunction = () => false;
var AIThinkingTime = 30;

var CLICK_TO_SELECT = true; //S.settings.clickToSelect = true;
//var OPEN_TAB = 'Seattle'; //S.settings.openTab = S_openTab;
var USE_SETTINGS = true; //S.settings.userSettings = S_userSettings;
var USE_STRUCTURES = true; //S.settings.userStructures = S_userStructures;
var USE_BEHAVIORS = true; //S.settings.userBehaviors = S_userBehaviors;

//const PLAYER_CONFIG_FOR_MULTIPLAYER = ['me', 'human', 'human'];

const USE_SOCKETIO = false;
const USE_BACKEND_AI = true;
const IS_MIRROR = false;
const FLASK = true;
const PORT = '5000';
const NGROK = null;// 'http://ee91c9fa.ngrok.io/'; // null;//'http://f3629de0.ngrok.io/'; //null; //'http://b29082d5.ngrok.io/' //null; //'http://2d97cdbd.ngrok.io/';// MUSS / am ende!!! 

//achtung!!! NO / at end!!!!!!!
const SERVER = IS_MIRROR ? 'http://localhost:5555' : FLASK ? (NGROK ? NGROK : 'http://localhost:' + PORT) : 'http://localhost:5005';

