const SERVER = 'http://localhost:5000';
var USERNAME = 'felix';
var GAME = 'catan'; // catan | aristocracy | ttt | game01
var PLAYMODE = 'hotseat'; // multiplayer | hotseat | solo | passplay
var SEED = 1;

var USERSPEC_FNAME = 'catan_simple';

const TESTING = true; // true | false
const TEST_PATH = '/vid2/tests/';
const SPEC_VERSION = 1;
const CODE_VERSION = 1;
const DATA_VERSION = 1;

var SPEC = null; //merged userSpec and defaultSpec

//replace the following: TODO!!!!!!!!!!
// S.settings.seed = SEED;
// S.settings.game = GAME;
// S.settings.playmode = PLAYMODE;
var CLICK_TO_SELECT = true; //S.settings.clickToSelect = true;
var TOOLTIPS = false; //S.settings.tooltips = document.getElementById('c_b_TTip').textContent.includes('ON');
var OPEN_TAB = 'Seattle'; //S.settings.openTab = S_openTab;
var USE_SETTINGS = true; //S.settings.userSettings = S_userSettings;
var USE_STRUCTURES = true; //S.settings.userStructures = S_userStructures;
var USE_BEHAVIORS = true; //S.settings.userBehaviors = S_userBehaviors;

//TODO:::: SERVER oder SERVER_URL!!!!
const PLAYER_CONFIG_FOR_MULTIPLAYER = ['me', 'human', 'human'];

const USE_SOCKETIO = false;
const USE_BACKEND_AI = true;
const IS_MIRROR = false;
const FLASK = true;
const PORT = '5000';
const NGROK = null;// 'http://ee91c9fa.ngrok.io/'; // null;//'http://f3629de0.ngrok.io/'; //null; //'http://b29082d5.ngrok.io/' //null; //'http://2d97cdbd.ngrok.io/';// MUSS / am ende!!! 
const SERVER_URL = IS_MIRROR ? 'http://localhost:5555/' : FLASK ? (NGROK ? NGROK : 'http://localhost:' + PORT + '/') : 'http://localhost:5005/';

