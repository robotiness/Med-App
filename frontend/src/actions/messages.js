import { CREATE_MESSAGE, CHANGE_REDIRECT_URL, CHANGE_CURRENT_URL } from './types';
import { togglePopUp } from './popUp';
import { toggleLoading } from './loading';


// CREATE MESSAGE
export const createMessage = (text,alertType,time) => (dispatch) =>{
  let timeout = 3000;

  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  if(alertType=='danger'){
    dispatch(toggleLoading(false));
    dispatch(togglePopUp());
    timeout = 15000;
  }
  dispatch({
    type: CREATE_MESSAGE,
    payload: {text, alertType},
  });
  if(time){
    timeout = time;
  }
  if(text=="Token expired" || text=="User not found."){
    alert(window.location);
    dispatch({
      type: CHANGE_CURRENT_URL,
      payload:String(window.location)
    });
    window.location = '/auth/login';
  }
};
