import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { fetchCreateGuardian } from './guardian';
import { API_URI } from '../config/variables';

export const fetchGroups = (done) => (dispatch) => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/groups/" + localStorage.getItem('JWT'), {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch({
          type: FETCH_GROUPS,
          payload: res
        });
        if (done) {
          done(res);
        }
      }
    });
}


export const addDependent = (groupID, newDependent) => (dispatch) => {
  dispatch(toggleLoading(true));
  let updatedFields = { dependent: newDependent };
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      }
    });
}

export const addUser = (groupID, user, done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  dispatch(fetchCreateGuardian(user, (guardianCreated) => {
    let updatedFields = { guardian: guardianCreated };
    fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
      method: 'PATCH',
      body: JSON.stringify({ updatedFields: updatedFields }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (!rmLoading) {
          dispatch(toggleLoading(false));
        }
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
          if (done) {
            done(res);
          }
        }
      });
  }, rmLoading));
}

export const addGuardian = (groupID, guardian, done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  let updatedFields = { guardian: guardian };
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (!rmLoading) {
        dispatch(toggleLoading(false));
      }
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        if (done) {
          done(res);
        }
      }
    });
}

export const removeDependent = (groupID, depToDel, dependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  dependents = removeByID(depToDel._id, dependents);
  let updatedFields = { dependents: dependents };
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      }
    });
}

export const switchDependent = (newGroupID, oldGroupID, dep, dependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  dependents = removeByID(dep._id, dependents);
  let updatedFields = { dependents: dependents };
  fetch(API_URI + "/groups/" + oldGroupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(toggleLoading(true));
        let updatedFields = { dependent: dep };
        fetch(API_URI + "/groups/" + newGroupID + "/" + localStorage.getItem('JWT'), {
          method: 'PATCH',
          body: JSON.stringify({ updatedFields: updatedFields }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(res => {
            dispatch(toggleLoading(false));
            if (res.error) {
              dispatch(createMessage(res.error, 'danger'));
            }
          });
      }
    });
}

export const switchGuardian = (newGroupID, oldGroupID, guardian, guardians) => (dispatch) => {
  dispatch(toggleLoading(true));
  guardians = removeByID(guardian._id, guardians);
  let updatedFields = { guardians: guardians };
  fetch(API_URI + "/groups/" + oldGroupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(toggleLoading(true));
        let updatedFields = { guardian: guardian };
        fetch(API_URI + "/groups/" + newGroupID + "/" + localStorage.getItem('JWT'), {
          method: 'PATCH',
          body: JSON.stringify({ updatedFields: updatedFields }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(res => {
            dispatch(toggleLoading(false));
            if (res.error) {
              dispatch(createMessage(res.error, 'danger'));
            }
          });
      }
    });
}

export const removeGuardian = (groupID, guardianToDel, guardians) => (dispatch) => {
  dispatch(toggleLoading(true));
  guardians = removeByID(guardianToDel._id, guardians);
  let updatedFields = { guadians: guardians };
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      }
    });
}

function removeByID(id, arr) {
  let newArr = [];
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i]._id != id) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}