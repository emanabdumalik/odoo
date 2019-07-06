odoo.define('pos_product_category_filter.category_filter', function (require) {
"use strict";

var PosBaseWidget = require('point_of_sale.BaseWidget');
var chrome = require('point_of_sale.chrome');
var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var Model = require('web.DataModel');
var PosDB = require('point_of_sale.DB');

var QWeb = core.qweb;
var _t = core._t;

var _super_posmodel = models.PosModel.prototype;
models.PosModel = models.PosModel.extend({

    initialize: function(session, attributes) {
        var self=this;

        for(var i=0;i <= self.models.length;i++) {
            var mod=self.models[i];
            if(_.has(mod,'model')){
                if(mod.model == 'pos.category') {
                    self.models[i].ids = function(s) { 

                        if(s.config.single_mode){
                            return [s.config.pos_start_categ[0]];
                        }
                        else {
                            return s.config.pos_category_list;
                        }
                    }
                }
            }
        }
      

    _super_posmodel.initialize.call(this,session,attributes);


    models.load_fields("pos.config",['disable_click','enable_category_filter','pos_categories','pos_category_list','pos_start_categ']);
        
   },


});

  screens.ProductCategoriesWidget.include({
    init: function(parent, options){
        var self = this;
        this._super(parent,options);
        console.log(this.pos);
        this.start_categ_id = this.pos.config.pos_start_categ ? this.pos.config.pos_start_categ[0] : 0;
        if(this.pos.config.pos_start_categ) {
            this.set_category(this.pos.db.get_category_by_id(this.start_categ_id));
        }
    },
   renderElement: function(){
        //console.log('hey')
        
        var self=this;
        self._super();
        if(self.pos.config.disable_click) {
            var buttons = this.el.querySelectorAll('.js-category-switch');
            for(var i = 0; i < buttons.length; i++){
                buttons[i].removeEventListener('click',this.switch_category_handler);
            }
    }


    }



        })

});
