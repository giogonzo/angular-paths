'use strict';

describe('angular-paths directive', function() {
  var $compile, $rootScope, $timeout, Paths;
  var parentScopes = {}, scopes = {};
  var defaultViewport = {
    height: 0,
    width: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    innerWidth: 0,
    innerHeight: 0
  };

  var setupDirective = function(graph, cfgName, cfg) {
    parentScopes[graph] = $rootScope.$new(true);

    spyOn(Paths, graph).andCallThrough();

    parentScopes[graph][cfgName] = cfg;

    $compile('<div paths-' + graph.toLowerCase() + '="' + cfgName + '"></div>')(parentScopes[graph]);
    parentScopes[graph].$digest();
    scopes[graph] = parentScopes[graph].$$childHead;
  };

  beforeEach(module('paths'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _Paths_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    Paths = _Paths_;
  }));

  beforeEach(function() {
    setupDirective('Radar', 'radar', {
      data: [
        { hp: 45, attack: 49, defense: 80, sp_attack: 65, sp_defense: 65, speed: 45 },
        { hp: 60, attack: 62, defense: 63, sp_attack: 80, sp_defense: 80, speed: 60 }
      ],
      accessor: {
        attack: function(x) { return x.attack; },
        defense: function(x) { return x.defense; },
        speed: function(x) { return x.speed; }
      },
      rings: 5,
      padding: 10,
      width: 100,
      height: 100
    });

    setupDirective('Pie', 'pie', {
      data: [
        { name: 'Italy', population: 59859996 },
        { name: 'Vatican City', population: 768 }
      ],
      accessor: function(x) { return x.population; },
      width: 100,
      height: 100
    });

    setupDirective('Stock', 'stock', {
      data: [
        [13, 12, 15],
        [21, 22, 22]
      ]
    });

    setupDirective('Bar', 'bar', {
      data: [
        [3, 9, 5],
        [2, 4, 8]
      ],
      axes: {
        step: 2
      }
    });
  });


  describe('`viewport`', function() {
    it('should be updated with user dimensions, considering padding', function() {
      expect(scopes.Pie.viewport).toEqual(angular.extend(defaultViewport, {
        width: 100,
        height: 100,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        innerWidth: 100,
        innerHeight: 100
      }));
    });

    it('should be updated with user dimensions, considering padding', function() {
      expect(scopes.Radar.viewport).toEqual(angular.extend(defaultViewport, {
        width: 100,
        height: 100,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        innerWidth: 80,
        innerHeight: 80
      }));
    });
  });

  it('should update the `curves`, `rings` scope values', function() {
    expect(scopes.Radar.curves).toBeDefined();
    expect(scopes.Radar.rings).toBeDefined();
    expect(scopes.Radar.curves.length).toBe(parentScopes.Radar.radar.data.length);
    expect(scopes.Radar.rings.length).toBe(parentScopes.Radar.radar.rings);
  });

  it('should call the paths.Graph contructor with the first dataset', function() {
    expect(Paths.Radar.callCount).toBe(1);
    expect(Paths.Pie.callCount).toBe(1);
  });

  it('should call the paths.Graph contructor once per `cfg.data` change', function() {
    expect(Paths.Radar.callCount).toBe(1);

    parentScopes.Radar.radar.data[0].hp = 80;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(2);

    parentScopes.Radar.radar.data[0].hp = 50;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(3);
  });

  it('should call the paths.Graph contructor once per `cfg` change', function() {
    expect(Paths.Radar.callCount).toBe(1);

    parentScopes.Radar.radar.width = 10;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(2);

    parentScopes.Radar.radar.padding = 0;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(3);
  });

  it('should update scale functions in scope', function() {
    expect(scopes.Stock.yscale).toBeDefined();
    expect(scopes.Stock.xscale).toBeDefined();
  });

  it('should update x,y helpers axes in scope', function() {
    expect(scopes.Bar.y).toEqual([0, 2, 4, 6, 8]);
  });

  it('should precompute each graph\'s available shapes', function() {
    scopes.Radar.curves.forEach(function(curve) {
      expect(curve._polygon).toBeDefined();
      expect(curve._polygon).toEqual(curve.polygon.path.print());
    });

    scopes.Radar.rings.forEach(function(ring) {
      expect(ring._polygon).toBeDefined();
      expect(ring._polygon).toEqual(ring.path.print());
    });

    scopes.Pie.curves.forEach(function(curve) {
      expect(curve._sector).toBeDefined();
      expect(curve._sector).toEqual(curve.sector.path.print());
    });
  });

  it('should update each graph\'s available shapes', function() {
    scopes.Radar.curves.forEach(function(curve) {
      expect(curve._polygon).toBeDefined();
      expect(curve._polygon).toEqual(curve.polygon.path.print());
    });

    parentScopes.Radar.radar.data[0].hp = 80;
    scopes.Radar.$digest();

    scopes.Radar.curves.forEach(function(curve) {
      expect(curve._polygon).toBeDefined();
      expect(curve._polygon).toEqual(curve.polygon.path.print());
    });
  });

  it('should precompute scaled axes', function() {
    expect(scopes.Bar._y).toBeDefined();
    expect(scopes.Bar._y.length).toBe(scopes.Bar.y.length);
  });

  it('should update scaled axes', function() {
    var previousY = angular.copy(scopes.Bar._y);
    scopes.Bar.bar.axes = {
      steps: 2
    };
    scopes.Bar.$digest();

    expect(scopes.Bar._y).toBeDefined();
    expect(scopes.Bar._y.length).toBe(scopes.Bar.y.length);
    expect(scopes.Bar._y).not.toEqual(previousY);
  });

});