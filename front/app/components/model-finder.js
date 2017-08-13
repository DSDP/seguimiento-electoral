import Ember from 'ember';
import layout from '../templates/components/model-finder';

export default Ember.Component.extend({
  layout: layout,
  query: '',
  queryContent: null,
  modelName: 'user',
  list: null,
  selectedLabel: null,
  labelPath: 'name',
  countryFilter: null,
  townFilter: null,
  showPath: null,
  queryInterval: null,

  queryChanged: function () {
    
    if (this.get('queryInterval'))
      clearInterval(this.get('queryInterval'))
  
    var _this = this;  
    this.set('queryInterval', setInterval(function (){
      clearInterval(_this.get('queryInterval'));
      if (_this.get('query').length >= 1) {
        if (_this.get('townFilter')) {
          _this.set('queryContent', _this.get('store').find(_this.get('modelName'), {town: _this.get('townFilter'), name: _this.get('query')}));
        } else {
          if (_this.get('countryFilter')) {
            _this.set('queryContent', _this.get('store').find(_this.get('modelName'), {country: _this.get('countryFilter'), query: _this.get('query')}));
          } else {
            _this.set('queryContent', _this.get('store').find(_this.get('modelName'), {query: _this.get('query')}));
          }
        }
      }
      else {
        _this.set('queryContent', []);
      }
    }, 1000))
  }.observes('query'),


  listLabel: function () {
    if (this.get('showPath')) {
      return this.get('list').get(this.get('showPath'));
    } else {
      return this.get('list.name');
    }
  }.property('list'),

  actions: {
  	add: function (model) {
      if (this.get('sigle')) {
        this.set('selectedLabel', model.get(this.get('labelPath')));
  			this.set('list', model);
  		} else {
    		this.sendAction('model-selected', model)
    		this.set('queryContent', []);
      }
  	},
    delete: function () {
      this.set('list', null);
      this.set('selectedLabel', null);
    }
  }  
});
