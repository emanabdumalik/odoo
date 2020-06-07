odoo.define('human_resource_picture.attendance_greeting', function (require) {
"use strict";



var greeting_message = require('hr_attendance.greeting_message');


greeting_message.include({
 	init: function(parent, action) {
        var self = this;
        this._super.apply(this, arguments);
        if(action.attendance) {
       		this.employee_picture = '/web/image?model=hr.employee&id='+parseInt(this.attendance.employee_id[0])+'&field=image_medium';
       	}

    }


})
        //

});