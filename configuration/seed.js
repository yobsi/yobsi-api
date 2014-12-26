'use strict';

var Professional = require('../membership/professional/professional.model.js');

Professional.find({}).remove(function () {
  Professional.create(
    {
      provider: 'local',
      name: 'Wilson Balderrama',
      email: 'wilson.balderrama@gmail.com',
      password: 'sesamo'
    },
    {
      provider: 'local',
      name: 'Santiago Balderrama',
      email: 'santiago@gmail.com',
      password: 'sesamo'
    },
    {
      provider: 'local',
      name: 'Keila Balderrama',
      email: 'keila@gmail.com',
      password: 'sesamo'
    }
  );
});

