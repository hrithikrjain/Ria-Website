/* ============================================================
   RIA ART JEWELLERY — WHATSAPP MESSAGE BUILDER
   ============================================================ */

const WA_NUMBER = '919869939003';

window.buildWALink = function (product, selectedVariant) {
  const sv = selectedVariant || {};
  let variantLine = '';
  let price = null;

  if (product.pricing_type === 'SGM Finish Variants' && sv.finishes && sv.finishes.length) {
    variantLine = `\n✨ Selected Finishes: ${sv.finishes.join(', ')} (${sv.finishes.length} finish${sv.finishes.length > 1 ? 'es' : ''})`;
    price = sv.price;
  } else if (product.pricing_type === 'Colour Variants' && sv.colour) {
    variantLine = `\n🎨 Selected Colour: ${sv.colour}`;
    price = sv.price;
  } else if (product.pricing_type === 'Quantity Variants' && sv.label) {
    variantLine = `\n📦 Quantity: ${sv.label}`;
    price = sv.price;
  } else if (product.pricing_type === 'Single Price') {
    price = product.price;
  }

  const priceStr = price ? '₹' + price.toLocaleString('en-IN') : 'Please share price';
  const productUrl = `${window.location.origin}/products/${product.slug}`;

  const msg =
    `Hi! I'm interested in a piece from Ria Art Jewellery 💛\n\n` +
    `🪙 Product: ${product.title}\n` +
    `💰 Price: ${priceStr}${variantLine}\n` +
    `🏷️ Category: ${product.category}\n` +
    `🔗 Link: ${productUrl}\n\n` +
    `Please confirm availability and details. Thank you!`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
};

window.buildWALinkSimple = function (product) {
  const price = window.getPriceDisplay ? window.getPriceDisplay(product) : '';
  const productUrl = `${window.location.origin}/products/${product.slug}`;

  const msg =
    `Hi! I'm interested in "${product.title}" from Ria Art Jewellery.\n\n` +
    `Category: ${product.category}\n` +
    `Price: ${price}\n` +
    `Link: ${productUrl}\n\n` +
    `Please share availability and details. Thank you!`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
};

window.buildVaultWALink = function (items) {
  if (!items || !items.length) return `https://wa.me/${WA_NUMBER}`;

  let lines = items.map(item => {
    const price = item.price ? '₹' + item.price.toLocaleString('en-IN') : '';
    const variant = item.variant ? ` (${item.variant})` : '';
    return `• ${item.title}${variant} — ${price}`;
  });

  const total = items.reduce((sum, i) => sum + (i.price || 0), 0);
  const totalStr = total ? '₹' + total.toLocaleString('en-IN') : '';

  const msg =
    `Hi! I'd like to enquire about these pieces from Ria Art Jewellery 💛\n\n` +
    lines.join('\n') +
    (totalStr ? `\n\nEstimated Total: ${totalStr}` : '') +
    `\n\nPlease confirm availability and final pricing. Thank you!`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
};
