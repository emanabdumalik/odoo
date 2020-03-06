# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class PosOrderline(models.Model):
    _inherit = 'pos.order.line'

    product_name= fields.Char()
    