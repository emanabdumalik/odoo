# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models
from odoo.tools.float_utils import float_round


class ProductProduct(models.Model):
	_inherit = 'product.product'


	def _pos_sales_count(self):
		r = {}
		domain = [
			('state', 'in', ['paid', 'done']),
			('product_id', 'in', self.ids),
			('price_total','>',0)
		]
		for group in self.env['report.pos.order'].read_group(domain, ['product_id', 'product_qty'], ['product_id']):
			r[group['product_id'][0]] = group['product_qty']
		for product in self:
			product.pos_sales_count = float_round(r.get(product.id, 0), precision_rounding=product.uom_id.rounding)
		return r

	pos_sales_count = fields.Integer(compute='_pos_sales_count', string='#POS Sales')



class ProductTemplate(models.Model):
	_inherit = 'product.template'



	@api.depends('product_variant_ids.pos_sales_count')
	def _pos_sales_count(self):
		for product in self:
			product.pos_sales_count = sum([p.pos_sales_count for p in product.product_variant_ids])


	def action_view_pos_sales(self):
		self.ensure_one()
		action = self.env.ref('pos_sales_on_product.action_product_pos_sale_list')
		product_ids = self.with_context(active_test=False).product_variant_ids.ids

		return {
			'name': action.name,
			'help': action.help,
			'type': action.type,
			'view_id':self.env.ref('pos_sales_on_product.view_product_pos_order_line_tree').id,
			'view_mode': action.view_mode,
			'target': action.target,
			'context': "{'default_product_id': " + str(product_ids[0]) + "}",
			'res_model': action.res_model,
			'domain': [('order_id.state', 'in', ['paid', 'done']), ('product_id.product_tmpl_id', '=', self.id)],
		}

	pos_sales_count = fields.Integer(compute='_pos_sales_count', string='# POS Sales')
   
