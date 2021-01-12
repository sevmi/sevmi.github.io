/*
  Container for LocalStorage.
  By : Adnan Hidayat (komputok@gmail.com)

  Provide standarized command to add remove and get data from local storage.
  Also provided some text obsfuscator so data that saved in localstorage not in plain text
*/

/* Some simple text obfuscator */

const doTheThing = (key, data) => {
  let me = data + '' // unlink reference
  key = Number(String(Number(key))) === key ? Number(key) : 13 // optionaly provide key for symmetric-like-""encryption"".

  me = me.split('') // to array of characters.
    .map(function (c) { return c.charCodeAt(0) }) // to array of numbers (each is character's ASCII value)
    .map(function (i) { return i ^ key }) // XOR ""ENCRYPTION""

  me = String.fromCharCode.apply(undefined, me) // one-liner trick: array-of-numbers to array-of-characters (ASCII value), join to single string. may result in buffer-overflow on long string!
  return me
}

const k = 99

var temp = [];

export default class LocalStorage {
  static saveTemp(key, data) {
    temp[key] = data;
  }

  static getTemp(key){
    return temp[key];
  }

  static removeTemp(){
    temp.length = 0;
    temp = [];
  }

  static saveJSON (key, data) {
    try {
      if (key && data) {
        localStorage.setItem(key, doTheThing(k, JSON.stringify(data)))

        return true
      } else {
        throw new Error()
      }
    } catch (e) {
      return false
    }
  }

  static getJSON (key) {
    try {
      let data = doTheThing(k, localStorage.getItem(key))
      return JSON.parse(data)
    } catch (e) {
      return false
    }
  }

  static remove (key) {
    if (key) {
      if (Array.isArray(key)) {
        for (let x in key) {
          localStorage.removeItem(key[x])
        }
      } else {
        localStorage.removeItem(key)
      }

      return true
    }

    return false
  }

  static clear () {
    localStorage.clear()
  }
}
