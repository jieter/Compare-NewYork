/**
 * Tilelayer with shape to mask the layer.
 */



L.TileLayer.Masked = L.TileLayer.extend({
	_mask: true,

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
		if (!this._mask) {
			this._setClipPath();
			return;
		}
		var center = this._map
			._getCenterLayerPoint()
			.add(L.DomUtil.getViewportOffset(this._container));

		this._setClipPath({
			x: center.x,
			y: center.y,
			r: 150
		});
	},

	toggleMask: function () {
		this._mask = !this._mask;
		this._updateClipPath();
		return this;
	},

	_setClipPath: function (options) {
		this._container.style.webkitClipPath = this._map && options ?
			L.Util.template('circle({x}px, {y}px, {r}px)', options) :
			'';
	}
});

L.tileLayer.masked = function (url, options) {
	return new L.TileLayer.Masked(url, options);
};