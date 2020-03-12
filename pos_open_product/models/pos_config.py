# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models,api


class PosConfig(models.Model):
	_inherit = 'pos.config'

	iface_openproduct = fields.Boolean(string='Enable Open Food', help='Enables Open Food on POS')
	iface_open_product_id=fields.Many2one("product.product",string="Product to use for Open Food")
	iface_openproduct_pin=fields.Boolean(default="Enable Pin request on Open Product")

	@api.multi
	def create_open_product_template(self):
		for config in self:
			open_product={
				'name':'Open Product',
				'type':'service',
				'list_price':1.00,
				'available_in_pos':True

			}
			res=self.env['product.product'].create(open_product)
			if res:
				config.iface_open_product_id=res.id
			return True