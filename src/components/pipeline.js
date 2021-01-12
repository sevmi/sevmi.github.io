export default {
  "PresenceUsersTotal": function(dMonth, inUser){
    return [
      {
        'match': {
          'dMonth': dMonth,
          '_p_owner': {'$in':inUser}
        }
      }, {
        'group': {
          'objectId': '$_p_owner',  
          'Week': {
            '$sum': '$total.Week'
          },
          'Total': {
            '$sum': '$total.Total'
          }, 
          'Tepat': {
            '$sum': '$total.Tepat'
          }, 
          'Lambat': {
            '$sum': '$total.Lambat'
          }, 
          'Izin': {
            '$sum': '$total.Izin'
          }, 
          'Sakit': {
            '$sum': '$total.Sakit'
          }, 
          'Dispen': {
            '$sum': '$total.Dispen'
          }, 
          'Alpa': {
            '$sum': '$total.Alpa'
          }
        }
      }
    ]

  },
  "PresenceUsersTotalWithSchedule": function(dMonth, inUser){
    return [
      {
        'match': {
          'dMonth': dMonth,
          '_p_owner': {'$in':inUser}
        }
      }, {
        'group': {
          'objectId': '$_p_owner', 
          '_p_owner': {
            $first: '$_p_owner'
          }, 
          'Week': {
            '$sum': '$total.Week'
          },
          'Total': {
            '$sum': '$total.Total'
          },
          'Tepat': {
            '$sum': '$total.Tepat'
          }, 
          'Lambat': {
            '$sum': '$total.Lambat'
          }, 
          'Izin': {
            '$sum': '$total.Izin'
          }, 
          'Sakit': {
            '$sum': '$total.Sakit'
          }, 
          'Dispen': {
            '$sum': '$total.Dispen'
          }, 
          'Alpa': {
            '$sum': '$total.Alpa'
          }
        }
      }, {
          'lookup': {
              'from': 'Schedule', 
              'localField': '_p_owner', 
              'foreignField': '_p_owner', 
              'as': 'Jadwal'
          }
      }, {
          'project': {
              'Jadwal': {
                  '$size': '$Jadwal'
              },
              'objectId': 1,
              'Total': 1,
              'Week': 1,
              'Tepat': 1, 
              'Lambat': 1, 
              'Izin': 1, 
              'Sakit': 1, 
              'Dispen': 1, 
              'Alpa': 1
          }
      }
    ]

  }
}