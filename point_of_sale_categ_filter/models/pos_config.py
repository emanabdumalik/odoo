# -*- coding: utf-8 -*-

from odoo import api,fields, models


class PosConfig(models.Model):
	_inherit = 'pos.config'

	enable_category_filter=fields.Boolean(default=False,help="Enable category filter on Point of Sale")
	single_mode=fields.Boolean(default=False,help="Enable only a single category on Point of Sale")
	disable_click=fields.Boolean(default=False,help="Disable Clicking on category lists")
	pos_start_categ=fields.Many2one('pos.category',help="Start category for Point of Sale in Single Mode")
	pos_categories=fields.Many2many('pos.category',help="List of categories to use on Point of Sale, Multi mode only")
	pos_category_list=fields.Many2many('pos.category',compute="_get_pos_cat", store=True)
	@api.depends('pos_categories')
	@api.multi
	def _get_pos_cat(self):
		for x in self:
			def get_ids(cat):
				res = []
				while cat:
					#if cat.id not in res:
					res.append(cat.id)
					cat = cat.parent_id
				return res
			cat_list=[]
			for c in x.pos_categories:
				
				cat_list += reversed(get_ids(c))
		
			x.pos_category_list=[(6,0,cat_list)]

		return True


