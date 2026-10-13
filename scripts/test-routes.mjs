const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const routesToTest = [
  { path: '/', expectStatus: 200, label: 'Homepage' },
  { path: '/buy-peptides/', expectStatus: 200, label: 'Catalog: Buy Peptides' },
  { path: '/product-category/peptides/', expectStatus: 200, label: 'Category: Peptides' },
  { path: '/product-category/blends/', expectStatus: 200, label: 'Category: Blends' },
  { path: '/product/bpc-157/', expectStatus: 200, label: 'Product Detail: BPC-157' },
  { path: '/product/cjc-1295-dac-5mg/', expectStatus: 200, label: 'Product Detail: CJC-1295 DAC 5mg' },
  { path: '/cart/', expectStatus: 200, label: 'Cart Page' },
  { path: '/checkout/', expectStatus: 200, label: 'Checkout Page' },
  { path: '/my-account/', expectStatus: 200, label: 'My Account Page' },
  { path: '/contact-us/', expectStatus: 200, label: 'Contact Us Page' },
  { path: '/knowledge-center/', expectStatus: 200, label: 'Knowledge Center' },
  { path: '/news/', expectStatus: 200, label: 'News / Blog Index' },
  { path: '/what-is-bpc-157/', expectStatus: 200, label: 'Blog Article: What is BPC-157' },
  { path: '/about/', expectStatus: 200, label: 'Static Page: About' },
  { path: '/shipping/', expectStatus: 200, label: 'Static Page: Shipping' },
  { path: '/privacy-policy/', expectStatus: 200, label: 'Static Page: Privacy Policy' },
  { path: '/terms-and-conditions/', expectStatus: 200, label: 'Static Page: Terms and Conditions' },
  { path: '/accessibility/', expectStatus: 200, label: 'Static Page: Accessibility' },
  { path: '/dr-usman/', expectStatus: 200, label: 'Static Page: Dr. Usman' },
  { path: '/cash-app-payment-instructions/', expectStatus: 200, label: 'Static Page: Cash App Instructions' },
  { path: '/success-page/?order=100099999', expectStatus: 200, label: 'Order Confirmation Page' },
];

async function runTests() {
  console.log(`Starting automated route & functional verification against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;

  // 1. Test HTML routes
  for (const item of routesToTest) {
    try {
      const res = await fetch(`${BASE_URL}${item.path}`);
      if (res.status === item.expectStatus) {
        console.log(`[PASS] ${item.label.padEnd(35)} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${item.label.padEnd(35)} -> HTTP ${res.status} (Expected ${item.expectStatus})`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERR]  ${item.label.padEnd(35)} -> ${err.message}`);
      failed++;
    }
  }

  // 2. Test Search API
  try {
    const res = await fetch(`${BASE_URL}/api/search?q=bpc`);
    const data = await res.json();
    const results = data.results || data;
    if (res.status === 200 && Array.isArray(results) && results.length > 0) {
      console.log(`[PASS] API: Autocomplete Search (/api/search?q=bpc) -> Found ${results.length} results`);
      passed++;
    } else {
      console.error(`[FAIL] API: Autocomplete Search failed:`, data);
      failed++;
    }
  } catch (err) {
    console.error(`[ERR]  API Search -> ${err.message}`);
    failed++;
  }

  // 3. Test Contact Form API
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated QA Test',
        email: 'qa@biotechpeptides.local',
        phone: '555-0199',
        subject: 'Reconstruction Verification',
        message: 'This is an automated test verifying the contact endpoint and SQLite persistence.',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.inquiry?.id) {
      console.log(`[PASS] API: Contact Submission (/api/contact) -> ID #${data.inquiry.id}`);
      passed++;
    } else {
      console.error(`[FAIL] API: Contact Submission failed:`, data);
      failed++;
    }
  } catch (err) {
    console.error(`[ERR]  API Contact -> ${err.message}`);
    failed++;
  }

  // 4. Test Checkout Order API
  try {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        billing: {
          firstName: 'Jane',
          lastName: 'Researcher',
          company: 'BioTech Labs QA',
          country: 'US',
          address1: '123 Laboratory Way',
          city: 'Cambridge',
          state: 'MA',
          postcode: '02138',
          phone: '617-555-0123',
          email: 'jane@biotechlabs.example',
        },
        items: [
          {
            id: 1,
            productId: 687,
            name: 'BPC-157 5mg',
            slug: 'bpc-157',
            price: 52,
            quantity: 5,
            tierDiscount: 5,
          },
        ],
        subtotal: 260,
        discount: 13,
        shippingFee: 11.25,
        total: 258.25,
        paymentMethod: 'cashapp',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.orderNumber) {
      console.log(`[PASS] API: Checkout Submission (/api/checkout) -> Order #${data.orderNumber}`);
      passed++;
    } else {
      console.error(`[FAIL] API: Checkout Submission failed:`, data);
      failed++;
    }
  } catch (err) {
    console.error(`[ERR]  API Checkout -> ${err.message}`);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`QA Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
