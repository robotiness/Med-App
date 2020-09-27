const groupModel = require('../models/group/Group');
const dependentModel = require('../models/dependent/Dependent');
const guardianModel = require('../models/guardian/Guardian');
const val = require('./helpers/helper');

function findById(id, callback) {
  groupModel.findById(id, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("No group found.");
    } else {
      callback(null, result);
    }
  });
}
function findAll(callback) {
  groupModel.find({}).populate('dependents').populate('guardians').exec(function (err, res) {
    if (err) {
      callback(err);
    } else {
      console.log(res);
      callback(null, res);
    }
  });
}
function patchUpdateById(body, id, callback) {
  groupModel.findById(id, function (err, foundDoc) {
    if (err) {
      callback(err);
    } else if (!foundDoc) {
      callback("Document not found.");
    } else {
      updateModifiedFields(foundDoc, body, function (err, newDoc) {
        if (err) {
          callback(err);
        } else {
          foundDoc.update(newDoc, function (err, result) {
            if (err) {
              callback(err);
            } else {
              callback(null, newDoc);
            }
          });
        }
      });
    }
  });
}
function removeDependent(dependent, oldDependents) {
  let id = dependent;
  if (typeof (dependent) == 'object') {
    id = dependent._id;
  }

  return removeByID(id, oldDependents);
}
function updateModifiedFields(oldDoc, body, callback) {
  var groupname = oldDoc.name;
  var dependents = oldDoc.dependents;
  var guardians = oldDoc.guardians;
  var pictureUrl = oldDoc.pictureUrl;

  if (body.pictureUrl) {
    pictureUrl = body.pictureUrl;
  }
  if (body.name) {
    groupname = body.name;
  }

  let obj = {
    name: groupname,
    pictureUrl: pictureUrl,
    dependents: dependents,
    guardians: guardians
  };

  saveAndUpdateDoc(obj, body, function (err, newDoc) {
    if (err) {
      callback(err);
    } else {
      callback(null, newDoc);
    }
  });

}
function saveAndUpdateDoc(newDoc, body, callback) {
  let count = 0;
  let index = 0;

  if (body.removeDependentID) {
    count++;
  }
  if (body.dependentID) {
    count++;
  }
  // if(body.removeGuardianID){
  //   count++;
  // }
  if (body.guardianID) {
    count++;
  }

  if (body.removeDependentID) {
    body.dependents = removeDependent(body.removeDependentID, dependents);
    index++;
    if (index == count) {
      callback(null, newDoc);
    }
  }
  if (body.dependentID) {
    addDependentToGroup(obj, body.dependentID, function (err, newDoc) {
      index++;
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        callback(null, newDoc)
      }
    });
  }
  if (body.guardianID) {
    addGuardianToGroup(obj, body.guardianID, function (err, newDoc) {
      index++;
      if (err && index == count) {
        callback(err);
      } else if (index == count) {
        callback(null, newDoc);
      }
    });
  }
  // if(body.removeGuardianID){
  //   count++;
  // }
  if (count == 0) {
    callback(null, newDoc);
  }
}
function addDependentToGroup(newDoc, dependentId, callback) {
  dependentModel.findById(dependentId, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("Dependent not found.");
    } else {
      newDoc.dependents.push(result);
      callback(null, newDoc);
    }
  });
}
function addGuardianToGroup(newDoc, guardianId, callback) {
  guardianModel.findById(guardianId, function (err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      callback("Guardian not found.");
    } else {
      newDoc.guardians.push(result);
      callback(null, newDoc);
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
function deleteById(id, callback) {
  groupModel.findOneAndDelete({ _id: id }, function (err, deletedDoc) {
    if (err) {
      callback(err);
    } else {
      callback(null, deletedDoc);
    }
  });
}
function saveToDoc(body, callback) {
  var newDoc = new groupModel({
    name: body.name,
  });

  saveAndUpdateDoc(newDoc, body, function (err, newDoc) {
    if (err) {
      callback(err)
    } else {
      newDoc.save(function (err, savedDoc) {
        if (err) {
          callback(err);
        } else {
          callback(null, savedDoc);
        }
      });
    }
  });

}
function create(body, callback) {
  val.validator(groupModel, body, function (err, result) {
    if (err) {
      callback(err);
    } else {
      saveToDoc(body, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
}


module.exports = { create, findAll, deleteById, findById, patchUpdateById };
