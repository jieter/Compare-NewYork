/**
 * Tilelayer a mask.
 */



L.TileLayer.Masked = L.TileLayer.extend({
	_mask: true,

	initialize: function (url, options) {
		L.TileLayer.prototype.initialize.call(this, url, options);

		this.options.maskOffset = this.options.maskOffset || L.point(0, 0);
		this._masked = this.options.initiallyMasked || false;
	},

	onAdd: function (map) {
		L.TileLayer.prototype.onAdd.call(this, map);
		map.on({
			'viewreset': this._updateClipPath,
			'move': this._updateClipPath
		}, this);

		this._updateClipPath();
	},

	onRemove: function (map) {
		L.TileLayer.prototype.onRemove.call(this, map);

		map.off({
			'viewreset': this._updateClipPath,
			'move': this._updateClipPath
		}, this);
	},

	_updateClipPath: function () {
		if (!this._map) {
			return;
		}
		if (!this._masked) {
			this._setClipPath();
			return;
		}
		var map = this._map;

		var center = map._getCenterLayerPoint()
			.add(L.DomUtil.getViewportOffset(this._container))
			.subtract(L.DomUtil.getViewportOffset(map.getContainer()))
			.add(this.options.maskOffset);

		this._setClipPath({
			x: center.x,
			y: center.y,
			r: 150
		});
	},

	toggleMask: function () {
		return this.setMask();
	},
	setMask: function (val) {
		this._masked = (val !== undefined) ? val : !this._masked;

		this._updateClipPath();
		return this;
	},

	_setClipPath: function (options) {
		this._container.style.webkitClipPath = (this._map && options) ?
			L.Util.template('circle({x}px, {y}px, {r}px)', options) : '';
	}
});

L.tileLayer.masked = function (url, options) {
	return new L.TileLayer.Masked(url, options);
};