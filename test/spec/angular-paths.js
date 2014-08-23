'use strict';

describe('angular-paths directive', function() {
  var $compile, $rootScope, $timeout, Paths;
  var parentScopes = {}, scopes = {};

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
      width: 100,
      height: 100
    });

    setupDirective('Pie', 'pie', {
      data: [
        { name: 'Italy', population: 59859996 },
        { name: 'Vatican City', population: 768 }
      ],
      accessor: function(x) { return x.population; }
    });
  });


  it('should update the `viewport` scope object with user dimensions', function() {
    expect(scopes.Radar.viewport).toEqual({
      width: 100,
      height: 100
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

  it('should call the paths.Graph contructor once per `data` change', function() {
    expect(Paths.Radar.callCount).toBe(1);

    parentScopes.Radar.radar.data[0].hp = 80;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(2);

    parentScopes.Radar.radar.data[0].hp = 50;
    scopes.Radar.$digest();

    expect(Paths.Radar.callCount).toBe(3);
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
});