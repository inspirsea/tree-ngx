[![npm version](https://badge.fury.io/js/tree-ngx.svg)](https://badge.fury.io/js/tree-ngx)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# tree-ngx

## Introduction
Tree-ngx is designed to be usable "out of the box", as well as being highly customizable. Tested in angular 4 and 5, and in Chrome, FF, Opera, Edge.

## Supports

Selection

Tri-state checkboxes

Filtering

Custom Templates

Custom Styling

Callbacks

## Documentation

View the full documentation at http://emilsunesson.com/code/tree-ngx-intro

## Demo

Live demo can be found in the documentation http://emilsunesson.com/code/tree-ngx-intro

## Installation

```sh
$> npm install tree-ngx --save
```

```sh
@import '~tree-ngx/style/ngx-tree.scss';
```

```sh
import { TreeNgxModule } from 'tree-ngx';
  
@NgModule({
  imports: [TreeNgxModule]
}
```

## Example

### Template

```sh
<tree-ngx [nodeItems]="nodeItems"> </tree-ngx>
```

### Data
  
```sh
this.nodeItems = [{
    id: '0',
    name: 'Heros',
    children: [
      {
        id: '1',
        name: 'Batman',
        item: {
          phrase: 'I am the batman'
        }
      },
      {
        id: '2',
        name: 'Superman',
        item: {
          phrase: 'Man of steel'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Villains',
    children: [
      {
        id: '4',
        name: 'Joker',
        item: {
          phrase: 'Why so serius'
        }
      },
      {
        id: '5',
        name: 'Lex luthor',
        item: {
          phrase: 'I am the villain of this story'
        }
      }
    ]
  }];
```  
