# -*- coding: utf-8 -*-
# Copyright 2015 Savoir-faire Linux. All Rights Reserved.
# Copyright 2017 Serpent Consulting Services Pvt. Ltd.
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from odoo import fields, models,api,_


class Steps(models.Model):
	_name = 'steps.steps'
	_order="sequence asc"
	name = fields.Char(required=True)
	active=fields.Boolean(default=True)
	sequence=fields.Integer()
	chart = fields.Char(string="Chart", required=True)
	description=fields.Html(string="Description")

	@api.model
	def update_thumb(self,kwargs):
		pass
