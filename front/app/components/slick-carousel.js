import SlickCarousel from 'ember-cli-slick-carousel/components/slick-carousel';

export default SlickCarousel.extend({
	willDestroyElement: function () {
		this.$().slick('unslick');
	}
});