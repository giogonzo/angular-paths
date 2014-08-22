# angular-paths
Does the usual small things to "angularize" [paths.js](https://github.com/andreaferretti/paths-js):
- wraps the `paths` global in an injectable `Paths` service
- provides a bunch of directives for paths' [high-level API](https://github.com/andreaferretti/paths-js#high-level-api-graphs)

## In addition
The directives pre-compute svg paths for `line`, `area` and `sector`, and make them accessible from `curve._line`, `curve._area` and `curve._sector` respectively.

The traditional `paths` approach of calling `curve.<shape>.path.print()` in a template would't match well with `angular` digest cycle performance-wise (especially in the typical `ng-repeat` scenario).

## Install
`bower install angular-paths`

## Usage
Declare the `paths` dependency somewhere in your app, and either inject the `Paths` service in order to access all `paths` APIs or use any of the `paths-<graph>` directives as in
```html
<div paths-bar="barConfig">
    <svg ng-attr-width="{{viewport.width}}" ng-attr-height="{{viewport.height}}">
      <path ng-repeat="curve in curves" ng-attr-d="{{curve._line}}"/>
    </svg>
</div>
```
where
- the `paths-<graph>` attribute specifies what to pass to the `path.<Graph>` constructor, e.g.:
    ```
    scope.barConfig = {
      data: [
        [
          { name: 'Italy', population: 59859996 },
          { name: 'Spain', population: 46704314 },
          { name: 'France', population: 65806000 },
          { name: 'Romania', population: 20121641 },
          { name: 'Greece', population: 10815197 }
        ],
        [
          { name: 'Zambia', population: 14580290 },
          { name: 'Cameroon', population: 20386799 },
          { name: 'Nigeria', population: 173615000 },
          { name: 'Ethiopia', population: 86613986 },
          { name: 'Ghana', population: 24658823 }
        ]
      ],
      accessor: function(x) { return x.population; },
      gutter: 10,
      height: 100,
      template: 'templates/bar.html'
    };
    ```
    see [paths docs](https://github.com/andreaferretti/paths-js#high-level-api-graphs) for each specific graph options.

- `barConfig.data` is two-way binded (and the computed paths updated accordingly)

- `viewport` always contains `width` and `height`. By default, those are equal to the element computed size, but can be overidden using `paths` own `width` and `height` options

- templates can be embedded inside the `paths-<graph>` element directly or inlined/included using the `paths-template` attribute or the `config.template` option.

See [working examples](/example) for more details.