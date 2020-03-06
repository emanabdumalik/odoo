# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    iface_splittable = fields.Boolean(string='Enable Split Table', help='Enables orderline transfer to tables')
    iface_splittable_pin = fields.Boolean(string='Request Pin on Split', help='Enables to show pin request popup')
    iface_splittable_note=fields.Boolean(string='Request Note on Split')
