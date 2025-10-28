import {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const lines = input.cart.lines;

  // デバッグログ出力
  console.log("=== SOVS Checkout Validation Debug ===");
  console.log("Cart lines count:", lines.length);
  
  // カート内の全商品をログ出力
  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}:`, {
      sku: line.merchandise.__typename === "ProductVariant" ? line.merchandise.sku : "N/A",
      quantity: line.quantity,
      attributes: line.attribute ? {
        key: line.attribute.key,
        value: line.attribute.value
      } : "No attributes"
    });
  });

  // 特別商品（SKU: gftbgA）
  const specialItems = lines.filter(
    (line) => line.merchandise.__typename === "ProductVariant" && line.merchandise.sku === "gftbgA"
  );

  // ギフト対象商品（Gift_Wrapping = gift）
  const giftWrappedItems = lines.filter(
    (line) =>
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.sku !== "gftbgA" &&
      line.attribute?.key === "Gift_Wrapping" && line.attribute?.value === "gift"
  );

  console.log("Special items (gftbgA) count:", specialItems.length);
  console.log("Gift wrapped items count:", giftWrappedItems.length);

  // 特別商品が存在する場合の検証
  if (specialItems.length > 0) {
    console.log("⚠️ Special item (gftbgA) detected!");
    if (giftWrappedItems.length === 0) {
      console.log("❌ ERROR: No gift wrapped items found - blocking checkout");
      return {
        errors: [
          {
            localizedMessage:
              "Gift wrapping option cannot be purchased alone. The products you intend to purchase are not available in your selected shipping destination country and are not in your cart. Please switch the destination country using the switcher button and enjoy your shopping.",
            target: "cart",
          },
        ],
      };
    } else {
      console.log("✅ Gift wrapped items found - allowing checkout");
    }
  } else {
    console.log("ℹ️ No special items - normal checkout flow");
  }

  console.log("=== Validation Complete ===");
  return { errors: [] };
}
