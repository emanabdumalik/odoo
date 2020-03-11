# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models,api

class res_users(models.Model):
    _inherit = 'res.users'

    

    @api.model
    def check_session_security_pin_number(self,pin):
        group_supervisor = self.env.ref('point_of_sale.group_pos_manager')
        supervisors = self.search([('groups_id', 'in', group_supervisor.id)])
        for user in supervisors:
            if str(user.pos_security_pin) == pin:
                return True
        return False