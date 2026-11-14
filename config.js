// ========= ID ========= //
// Bảng ánh xạ: User-Agent (đại diện app) -> [entitlement, product_id]
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'], // URL-decode = "车票票"
  'Locket': ['Gold']                                 // app Locket
};

// ========= PHẦN CỐ ĐỊNH ========= //

// Lấy User-Agent từ request
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// Parse body JSON trả về từ server (RevenueCat)
var obj = JSON.parse($response.body);

console.log("===== UA =====");
console.log(ua);
console.log("===== BODY GỐC =====");
console.log(JSON.stringify(obj, null, 2));

// Thêm dòng chú ý vào response
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// ---- Object giả lập 1 gói đăng ký (subscription) ----
var ohoang7 = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z",   // hết hạn rất xa (gần như vĩnh viễn)
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-07-28T01:04:18Z",
  purchase_date: "2024-07-28T01:04:17Z",
  store: "app_store"
};

// ---- Object giả lập 1 entitlement (quyền lợi premium) ----
var vuong2023 = {
  grace_period_expires_date: null,
  purchase_date: "2024-07-28T01:04:17Z",
  product_identifier: "com.ohoang7.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z"
};

// ---- Tìm app khớp với User-Agent ----
const match = Object.keys(mapping).find(function (e) {
  return ua.includes(e);
});

if (match) {
  // Nếu tìm thấy app trong mapping
  let entitlementId = mapping[match][0];  // ví dụ: "vip+watch_vip" hoặc "Gold"
  let productId     = mapping[match][1];  // ví dụ: undefined hoặc "Gold"

  if (productId) {
    // Có product_id riêng -> dùng nó
    vuong2023.product_identifier = productId;
    obj.subscriber.subscriptions[productId] = ohoang7;
  } else {
    // Không có -> dùng product mặc định
    obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = ohoang7;
  }

  // Gán entitlement
  obj.subscriber.entitlements[entitlementId] = vuong2023;

} else {
  // Không khớp app nào -> mặc định cấp quyền "pro"
  obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = ohoang7;
  obj.subscriber.entitlements.pro = vuong2023;
}

// Trả response đã sửa về cho app




obj.Attention = "Chúc mừng bạn!";
// (giả sử đã chèn premium...)

// ===== DEBUG: in body sau khi sửa =====
console.log("===== BODY SAU SỬA =====");
console.log(JSON.stringify(obj, null, 2));

$done({ body: JSON.stringify(obj) });
