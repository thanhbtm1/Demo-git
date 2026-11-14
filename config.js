const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

// ===== DEBUG: in body gốc =====
console.log("===== UA =====");
console.log(ua);
console.log("===== BODY GỐC =====");
console.log(JSON.stringify(obj, null, 2));

// ... phần sửa obj như cũ ...
obj.Attention = "Chúc mừng bạn!";
// (giả sử đã chèn premium...)

// ===== DEBUG: in body sau khi sửa =====
console.log("===== BODY SAU SỬA =====");
console.log(JSON.stringify(obj, null, 2));

$done({ body: JSON.stringify(obj) });
