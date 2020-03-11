# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models,api,_


class PosConfig(models.Model):
	_inherit = 'pos.config'

	@api.multi
	def open_active_session(self):
		session_id=self.env["pos.session"].search([("config_id","=",self.id),("state","=","opened")],limit=1)
		if session_id:
			ses={
				'views': [(False,'form')],
				'res_model': 'pos.session',
				'res_id': session_id.id,
				'target':'current',
				'type': 'ir.actions.act_window',
			}
			return ses
