
(function () {

  function myCurriedFunc (x, a, b) {
    console.log('x:' + x);
    return a + b + x;
  }

  function myNormalFunc (a, b) {
    return a + b;
  }

  function run (cb) {
    console.log(cb(1, 2));
  }

  // run(myNormalFunc);
  run( myCurriedFunc.bind(undefined, 3) );

})();
