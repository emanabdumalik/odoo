odoo.define('split_table_pos.split_table_pos', function (require) {
    "use strict";

    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var popups=require('point_of_sale.popups');
    var QWeb = core.qweb;
    var _t = core._t;
    var Model   = require('web.Model');
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function() {
            _super_order.initialize.apply(this,arguments);
            if (!this.split_note) {
                this.split_note = false;
            }
            this.save_to_db();
        },
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.apply(this,arguments);
            
            json.split_note  = this.split_note ? this.split_note : false;
            return json;
        },
        init_from_JSON: function(json) {
            _super_order.init_from_JSON.apply(this,arguments);
            this.split_note = json.split_note
            
        },
        export_for_printing: function() {
            var json = _super_order.export_for_printing.apply(this,arguments);
            json.split_note = this.split_note ? this.split_note : undefined;
            
            return json;
        },
        get_note: function(){
            return this.split_note;
        },
        set_note: function(note) {
            this.split_note = note;
            this.trigger('change');
        },
    });

    var SplittableScreenWidget = screens.ScreenWidget.extend({
        template: 'SplittableScreenWidget',

        previous_screen: 'products',

        renderElement: function(){
            var self = this;
            var linewidget;

            this._super();
            var order = this.pos.get_order();
            if(!order){
                return;
            }
            var orderlines = order.get_orderlines();
            for(var i = 0; i < orderlines.length; i++){
                var line = orderlines[i];
                linewidget = $(QWeb.render('SplittableOrderline',{ 
                    widget:this, 
                    line:line, 
                    selected: false,
                    quantity: 0,
                    id: line.id,
                }));
                linewidget.data('id',line.id);
                this.$('.orderlines').append(linewidget);
            }
            this.$('.back').click(function(){
                self.gui.show_screen(self.previous_screen);
            });

        },

        lineselect: function($el,order,neworder,splitlines,line_id){
            var split = splitlines[line_id] || {'quantity': 0, line: null};
            var line  = order.get_orderline(line_id);

            if( !line.get_unit().groupable ){
                if( split.quantity !== line.get_quantity()){
                    split.quantity = line.get_quantity();
                }else{
                    split.quantity = 0;
                }
            }else{
                if( split.quantity < line.get_quantity()){
                    split.quantity += line.get_unit().is_unit ? 1 : line.get_unit().rounding;
                    if(split.quantity > line.get_quantity()){
                        split.quantity = line.get_quantity();
                    }
                }else{
                    split.quantity = 0;
                }
            }

            if( split.quantity ){
                if ( !split.line ){
                    split.line = line.clone();
                    neworder.add_orderline(split.line);
                }
                split.line.set_quantity(split.quantity);
            }else if( split.line ) {
                neworder.remove_orderline(split.line);
                split.line = null;
            }

            splitlines[line_id] = split;
            $el.replaceWith($(QWeb.render('SplittableOrderline',{
                widget: this,
                line: line,
                selected: split.quantity !== 0,
                quantity: split.quantity,
                id: line_id,
            })));
            this.$('.order-info .subtotal').text(this.format_currency(neworder.get_subtotal()));
            var self=this;
      //  console.log(splitlines);
        //self.pos.split_lines=splitlines;
    },

    check_permission:function(order,neworder,splitlines){
        var self=this;
        if(this.pos.config.iface_splittable_pin){
         this.gui.show_popup('password',{
                'title': _t('Pin ?'),
                confirm: function(pw) {
                    var done = new $.Deferred();
                    var res_user = new Model('res.users');
                    res_user.call("check_splittable_security_pin_number", [pw]).then(function (value) {
                        //alert(value);
                       if(value){
                                if(self.pos.config.iface_splittable_note){

                             self.gui.show_popup('textarea',{
                                title: _t('Add Reason for Splitting'),
                                value:   "",
                                confirm: function(note) {
                                    neworder.set_note(note);
                                    self.pos.set_table(null);

                                   // self.move(order,neworder,splitlines)
                                    //_super_posmodel.set_table.apply(self,arguments);
                                    
                                },
                        });
                         }
                         else {
                                self.pos.set_table(null);

                               // self.move(order,neworder,splitlines)

                         }
                        

                    }
                    else {
                        alert('Wrong Pin Number!');

                    }
                    });
                   
                },
            });

     }
     else {
        if(this.pos.config.iface_splittable_note){
            self.gui.show_popup('textarea',{
                                title: _t('Add Reason for Splitting'),
                                value:   "",
                                confirm: function(note) {
                                    neworder.set_note(note);
                                    self.pos.set_table(null);

                                    //self.move(order,neworder,splitlines)
                                    //_super_posmodel.set_table.apply(self,arguments);
                                    
                                },
                        });
        }
        else {
               // self.move(order,neworder,splitlines)
                self.pos.set_table(null);


        }




     }

    },
    check_validity:function(order,neworder,splitlines){
        var orderlines = order.get_orderlines();
        var empty = true;
        var full  = true;

        for(var i = 0; i < orderlines.length; i++){
            var id = orderlines[i].id;
            var split = splitlines[id];
            if(!split){
                full = false;
            }else{
                if(split.quantity){
                    empty = false;
                    if(split.quantity !== orderlines[i].get_quantity()){
                        full = false;
                    }
                }
            }
        }
        
        if(empty){
            return;
        }

        delete neworder.temporary;
        this.pos.split_table_data={
            splitlines:splitlines,
            neworder:neworder,
            full:full,
            empty:empty,
            split_order:order,
        }
        this.check_permission(order,neworder,splitlines)
    },
    
    
    show: function(){
        var self = this;
        this._super();
        this.renderElement();

        var order = this.pos.get_order();
        var neworder = new models.Order({},{
            pos: this.pos,
            temporary: true,
        });
        neworder.set('client',order.get('client'));

        var splitlines = {};

        this.$('.orderlines').on('click','.orderline',function(){
            var id = parseInt($(this).data('id'));
            var $el = $(this);
            self.lineselect($el,order,neworder,splitlines,id);
        });
        this.$('.move-to-table').click(function(){
         self.check_validity(order,neworder,splitlines);
     });
        
    },


});

    gui.define_screen({
        'name': 'splittable', 
        'widget': SplittableScreenWidget,
        'condition': function(){ 
            return this.pos.config.iface_splittable
        },
    });
    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
    initialize: function(session, attributes) {
        this.split_table_data={
            splitlines:null,
            neworder:null,
            full:null,
            empty:null,
            split_order:null,
        }
        
        return _super_posmodel.initialize.call(this,session,attributes);
    },


    set_table: function(table) {
        var self=this;
        _super_posmodel.set_table.apply(this,arguments);
        if (!table) { // no table ? go back to the floor plan, see ScreenSelector
            this.set_order(null);
            //_super_posmodel.set_table.apply(this,arguments);
            //this.split_table_data.neworder = null
        }

        else if(this.split_table_data.neworder){


            if(self.split_table_data.full){
                self.gui.show_popup('confirm',_t('Please use Transfer!'));

                this.split_table_data.neworder=null;
                //this.split_table_data.split_order=null
                this.split_table_data.split_order.set_screen_data('screen','products');
            }
            else {
               
                        //_super_posmodel.set_table.apply(self,arguments);
                self.finalize_split_table(table);
                self.split_table_data.split_order.set_screen_data('screen','products');
                   

            }
        }
        

    },


    finalize_split_table:function(table){
                var self=this;

                for(var id in self.split_table_data.splitlines){
                    var split = self.split_table_data.splitlines[id];
                    var line  = self.split_table_data.split_order.get_orderline(parseInt(id));
                    line.set_quantity(line.get_quantity() - split.quantity);
                    if(Math.abs(line.get_quantity()) < 0.00001){
                        self.split_table_data.split_order.remove_orderline(line);
                    }
                    delete self.split_table_data.splitlines[id];
                }
                self.split_table_data.split_order.set_screen_data('screen','products');

                    // for the kitchen printer we assume that everything
                    // has already been sent to the kitchen before splitting 
                    // the bill. So we save all changes both for the old 
                    // order and for the new one. This is not entirely correct 
                    // but avoids flooding the kitchen with unnecessary orders. 
                    // Not sure what to do in this case.

                if ( self.split_table_data.neworder.saveChanges ) { 
                    self.split_table_data.split_order.saveChanges();
                    self.split_table_data.neworder.saveChanges();
                }
                this.split_table_data.neworder.table = table;
                this.get('orders').add(this.split_table_data.neworder);
                this.split_table_data.neworder.save_to_db();
                this.split_table_data.neworder=null
                var orders = this.get_order_list();


                console.log(this.split_table_data.neworder);
                this.set_table(table);
                this.set_order(orders[orders.length-1]);
                    

                    
                }
    





    
    })
    var SplittableButton = screens.ActionButtonWidget.extend({
        template: 'SplittableButton',
        button_click: function(){
         if(this.pos.get_order().get_orderlines().length > 0){
                 //this.pos.split_order_lines();
                 this.gui.show_screen('splittable');

             }
         },
     });

    screens.define_action_button({
        'name': 'splittablebutton',
        'widget': SplittableButton,
        'condition': function(){
            return this.pos.config.iface_splittable && this.pos.config.floor_ids.length
        },
    });

});

