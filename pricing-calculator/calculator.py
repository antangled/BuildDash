#!/usr/bin/env python3
"""
BuildDash Pricing Calculator
============================
Standalone tool for testing business model variables.

Usage:
  python calculator.py                    # Interactive mode
  python calculator.py --batch input.csv  # Batch mode from CSV
  python calculator.py --compare          # Compare scenarios side-by-side

Adjust any variable and see the full price breakdown:
  - What the buyer pays (itemized)
  - What the seller receives
  - What the platform keeps
  - Margin analysis
"""

import argparse
import csv
import sys
from dataclasses import dataclass
from typing import Optional


# ─── Pricing Constants (tweak these) ───────────────────────────────────────────

SHIPPING_TIERS = [
    (0, 25, 5.99),      # 0-25 miles
    (25, 50, 8.99),     # 25-50 miles
    (50, 100, 12.99),   # 50-100 miles
]
WEIGHT_SHIPPING_RATE = 0.05  # $/lb/mile for 100+ miles

COMMISSION_RATES = {
    "basic": 0.12,
    "pro": 0.15,
    "premium": 0.18,
}

BUILD_PASS_MONTHLY = 14.99
BUILD_PASS_FREE_SHIPPING_MIN = 25.00
LOCAL_PICKUP_SELLER_BONUS = 0.05  # 5% bonus to seller

SELLER_TIER_MONTHLY_FEES = {
    "basic": 0.00,
    "pro": 19.99,
    "premium": 49.99,
}


@dataclass
class PricingInput:
    """All tunable variables for a single pricing scenario."""
    fabrication_cost: float = 15.00        # What the seller charges ($)
    material_cost_per_gram: float = 0.02   # $/gram (PLA default)
    part_weight_grams: float = 50.0        # Estimated part weight
    distance_miles: float = 30.0           # Buyer-seller distance
    shipping_weight_lbs: float = 1.0       # Package weight for shipping
    commission_rate: Optional[float] = None # Override commission (0.0-1.0)
    seller_tier: str = "basic"             # basic, pro, premium
    has_build_pass: bool = False           # Buyer subscription
    delivery_method: str = "shipping"      # shipping or local_pickup
    quantity: int = 1                      # Number of parts


@dataclass
class PricingResult:
    """Full breakdown of a pricing scenario."""
    # Buyer pays
    fabrication_cost: float
    material_cost: float
    subtotal: float
    platform_fee: float
    shipping_cost: float
    build_pass_discount: float
    buyer_total: float

    # Seller receives
    seller_base_earnings: float
    local_pickup_bonus: float
    seller_total_earnings: float

    # Platform keeps
    platform_commission: float
    platform_shipping_margin: float
    platform_total_revenue: float

    # Analysis
    buyer_markup_pct: float
    seller_take_rate_pct: float
    platform_take_rate_pct: float


def calculate_shipping(distance_miles: float, weight_lbs: float = 1.0) -> float:
    """Calculate shipping cost based on distance tiers."""
    for min_mi, max_mi, cost in SHIPPING_TIERS:
        if min_mi <= distance_miles < max_mi:
            return cost

    # 100+ miles
    last_tier_cost = SHIPPING_TIERS[-1][2]
    last_tier_max = SHIPPING_TIERS[-1][1]
    extra = (distance_miles - last_tier_max) * WEIGHT_SHIPPING_RATE * weight_lbs
    return round(last_tier_cost + extra, 2)


def calculate_price(inp: PricingInput) -> PricingResult:
    """Calculate full price breakdown from input variables."""
    # Material cost
    material_cost = round(inp.material_cost_per_gram * inp.part_weight_grams * inp.quantity, 2)
    fabrication_cost = round(inp.fabrication_cost * inp.quantity, 2)
    subtotal = fabrication_cost + material_cost

    # Commission
    rate = inp.commission_rate if inp.commission_rate is not None else COMMISSION_RATES.get(inp.seller_tier, 0.12)
    platform_fee = round(subtotal * rate, 2)

    # Shipping
    shipping_cost = 0.0
    if inp.delivery_method == "shipping":
        shipping_cost = calculate_shipping(inp.distance_miles, inp.shipping_weight_lbs)

    # BuildPass discount
    build_pass_discount = 0.0
    if inp.has_build_pass and inp.delivery_method == "shipping" and subtotal >= BUILD_PASS_FREE_SHIPPING_MIN:
        build_pass_discount = shipping_cost
        shipping_cost = 0.0

    # Local pickup bonus
    local_pickup_bonus = 0.0
    if inp.delivery_method == "local_pickup":
        local_pickup_bonus = round(subtotal * LOCAL_PICKUP_SELLER_BONUS, 2)

    # Totals
    buyer_total = round(subtotal + platform_fee + shipping_cost, 2)
    seller_base_earnings = subtotal
    seller_total_earnings = round(seller_base_earnings + local_pickup_bonus, 2)
    platform_commission = platform_fee
    platform_shipping_margin = round(shipping_cost * 0.15, 2)  # ~15% margin on shipping labels
    platform_total_revenue = round(platform_commission + platform_shipping_margin, 2)

    # Analysis
    raw_cost = fabrication_cost + material_cost
    buyer_markup_pct = round((buyer_total - raw_cost) / raw_cost * 100, 1) if raw_cost > 0 else 0
    seller_take_rate_pct = round(seller_total_earnings / buyer_total * 100, 1) if buyer_total > 0 else 0
    platform_take_rate_pct = round(platform_total_revenue / buyer_total * 100, 1) if buyer_total > 0 else 0

    return PricingResult(
        fabrication_cost=fabrication_cost,
        material_cost=material_cost,
        subtotal=subtotal,
        platform_fee=platform_fee,
        shipping_cost=shipping_cost,
        build_pass_discount=build_pass_discount,
        buyer_total=buyer_total,
        seller_base_earnings=seller_base_earnings,
        local_pickup_bonus=local_pickup_bonus,
        seller_total_earnings=seller_total_earnings,
        platform_commission=platform_commission,
        platform_shipping_margin=platform_shipping_margin,
        platform_total_revenue=platform_total_revenue,
        buyer_markup_pct=buyer_markup_pct,
        seller_take_rate_pct=seller_take_rate_pct,
        platform_take_rate_pct=platform_take_rate_pct,
    )


def print_breakdown(inp: PricingInput, result: PricingResult, label: str = ""):
    """Pretty-print a full pricing breakdown."""
    sep = "=" * 60
    if label:
        print(f"\n{sep}")
        print(f"  {label}")
        print(sep)
    else:
        print(f"\n{sep}")
        print("  BuildDash Pricing Breakdown")
        print(sep)

    print(f"\n  INPUT VARIABLES:")
    print(f"    Fabrication cost:     ${inp.fabrication_cost:.2f}")
    print(f"    Material cost/gram:   ${inp.material_cost_per_gram:.3f}")
    print(f"    Part weight:          {inp.part_weight_grams:.0f}g")
    print(f"    Quantity:             {inp.quantity}")
    print(f"    Distance:             {inp.distance_miles:.0f} miles")
    print(f"    Shipping weight:      {inp.shipping_weight_lbs:.1f} lbs")
    print(f"    Seller tier:          {inp.seller_tier}")
    print(f"    Commission rate:      {(inp.commission_rate or COMMISSION_RATES[inp.seller_tier]) * 100:.0f}%")
    print(f"    Delivery:             {inp.delivery_method}")
    print(f"    BuildPass:            {'Yes' if inp.has_build_pass else 'No'}")

    print(f"\n  BUYER PAYS:")
    print(f"    Fabrication:          ${result.fabrication_cost:.2f}")
    print(f"    Material:             ${result.material_cost:.2f}")
    print(f"    ────────────────────────────")
    print(f"    Subtotal:             ${result.subtotal:.2f}")
    print(f"    Platform fee:         ${result.platform_fee:.2f}")
    print(f"    Shipping:             ${result.shipping_cost:.2f}")
    if result.build_pass_discount > 0:
        print(f"    BuildPass discount:  -${result.build_pass_discount:.2f}")
    print(f"    ════════════════════════════")
    print(f"    TOTAL:                ${result.buyer_total:.2f}")

    print(f"\n  SELLER RECEIVES:")
    print(f"    Base earnings:        ${result.seller_base_earnings:.2f}")
    if result.local_pickup_bonus > 0:
        print(f"    Local pickup bonus:   ${result.local_pickup_bonus:.2f}")
    print(f"    ════════════════════════════")
    print(f"    TOTAL:                ${result.seller_total_earnings:.2f}")

    print(f"\n  PLATFORM KEEPS:")
    print(f"    Commission:           ${result.platform_commission:.2f}")
    print(f"    Shipping margin:      ${result.platform_shipping_margin:.2f}")
    print(f"    ════════════════════════════")
    print(f"    TOTAL:                ${result.platform_total_revenue:.2f}")

    print(f"\n  ANALYSIS:")
    print(f"    Buyer markup:         {result.buyer_markup_pct}% over raw cost")
    print(f"    Seller take rate:     {result.seller_take_rate_pct}% of buyer total")
    print(f"    Platform take rate:   {result.platform_take_rate_pct}% of buyer total")
    print(f"{sep}\n")


def interactive_mode():
    """Run the calculator interactively with user input."""
    print("\n  BuildDash Pricing Calculator")
    print("  ============================")
    print("  Press Enter to use default values.\n")

    def get_float(prompt: str, default: float) -> float:
        val = input(f"  {prompt} [{default}]: ").strip()
        return float(val) if val else default

    def get_str(prompt: str, default: str, options: list[str]) -> str:
        val = input(f"  {prompt} [{default}] ({'/'.join(options)}): ").strip().lower()
        return val if val in options else default

    def get_bool(prompt: str, default: bool) -> bool:
        d = "y" if default else "n"
        val = input(f"  {prompt} [{d}] (y/n): ").strip().lower()
        if val == "y":
            return True
        if val == "n":
            return False
        return default

    inp = PricingInput(
        fabrication_cost=get_float("Fabrication cost ($)", 15.00),
        material_cost_per_gram=get_float("Material cost per gram ($)", 0.02),
        part_weight_grams=get_float("Part weight (grams)", 50.0),
        quantity=int(get_float("Quantity", 1)),
        distance_miles=get_float("Distance (miles)", 30.0),
        shipping_weight_lbs=get_float("Shipping weight (lbs)", 1.0),
        seller_tier=get_str("Seller tier", "basic", ["basic", "pro", "premium"]),
        delivery_method=get_str("Delivery method", "shipping", ["shipping", "local_pickup"]),
        has_build_pass=get_bool("Buyer has BuildPass?", False),
    )

    result = calculate_price(inp)
    print_breakdown(inp, result)


def compare_mode():
    """Compare multiple scenarios side by side."""
    print("\n  BuildDash Scenario Comparison")
    print("  =============================\n")

    base = PricingInput(fabrication_cost=20.00, part_weight_grams=80.0)

    scenarios = [
        ("10mi, Basic tier, Shipping", PricingInput(**{**base.__dict__, "distance_miles": 10.0})),
        ("50mi, Basic tier, Shipping", PricingInput(**{**base.__dict__, "distance_miles": 50.0})),
        ("200mi, Basic tier, Shipping", PricingInput(**{**base.__dict__, "distance_miles": 200.0})),
        ("10mi, Local Pickup", PricingInput(**{**base.__dict__, "distance_miles": 10.0, "delivery_method": "local_pickup"})),
        ("50mi, BuildPass", PricingInput(**{**base.__dict__, "distance_miles": 50.0, "has_build_pass": True})),
        ("50mi, Pro tier", PricingInput(**{**base.__dict__, "distance_miles": 50.0, "seller_tier": "pro"})),
        ("50mi, Premium tier", PricingInput(**{**base.__dict__, "distance_miles": 50.0, "seller_tier": "premium"})),
    ]

    # Table header
    print(f"  {'Scenario':<30} {'Buyer Pays':>10} {'Seller Gets':>12} {'Platform':>10} {'Markup%':>8}")
    print(f"  {'─' * 30} {'─' * 10} {'─' * 12} {'─' * 10} {'─' * 8}")

    for label, inp in scenarios:
        r = calculate_price(inp)
        print(f"  {label:<30} ${r.buyer_total:>8.2f} ${r.seller_total_earnings:>10.2f} ${r.platform_total_revenue:>8.2f} {r.buyer_markup_pct:>6.1f}%")

    print()

    # Also print full breakdowns
    for label, inp in scenarios:
        result = calculate_price(inp)
        print_breakdown(inp, result, label=label)


def batch_mode(csv_path: str):
    """Process multiple scenarios from a CSV file."""
    print(f"\n  Processing batch file: {csv_path}\n")

    try:
        with open(csv_path, "r") as f:
            reader = csv.DictReader(f)
            results = []
            for i, row in enumerate(reader):
                inp = PricingInput(
                    fabrication_cost=float(row.get("fabrication_cost", 15)),
                    material_cost_per_gram=float(row.get("material_cost_per_gram", 0.02)),
                    part_weight_grams=float(row.get("part_weight_grams", 50)),
                    distance_miles=float(row.get("distance_miles", 30)),
                    shipping_weight_lbs=float(row.get("shipping_weight_lbs", 1)),
                    seller_tier=row.get("seller_tier", "basic"),
                    delivery_method=row.get("delivery_method", "shipping"),
                    has_build_pass=row.get("has_build_pass", "false").lower() == "true",
                    quantity=int(row.get("quantity", 1)),
                )
                result = calculate_price(inp)
                label = row.get("label", f"Scenario {i + 1}")
                results.append((label, inp, result))
                print_breakdown(inp, result, label=label)

            # Summary table
            if results:
                print("\n  SUMMARY TABLE:")
                print(f"  {'Scenario':<30} {'Buyer Pays':>10} {'Seller Gets':>12} {'Platform':>10}")
                print(f"  {'─' * 30} {'─' * 10} {'─' * 12} {'─' * 10}")
                for label, _, r in results:
                    print(f"  {label:<30} ${r.buyer_total:>8.2f} ${r.seller_total_earnings:>10.2f} ${r.platform_total_revenue:>8.2f}")
                print()

    except FileNotFoundError:
        print(f"  Error: File '{csv_path}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"  Error processing CSV: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="BuildDash Pricing Calculator — test business model variables"
    )
    parser.add_argument(
        "--batch", type=str, metavar="CSV_FILE",
        help="Process scenarios from a CSV file"
    )
    parser.add_argument(
        "--compare", action="store_true",
        help="Compare predefined scenarios side by side"
    )
    parser.add_argument(
        "--quick", nargs="*", metavar="KEY=VALUE",
        help="Quick calculation: --quick fab=20 dist=50 tier=pro"
    )

    args = parser.parse_args()

    if args.batch:
        batch_mode(args.batch)
    elif args.compare:
        compare_mode()
    elif args.quick:
        inp = PricingInput()
        for kv in (args.quick or []):
            if "=" in kv:
                k, v = kv.split("=", 1)
                shortcuts = {
                    "fab": "fabrication_cost",
                    "mat": "material_cost_per_gram",
                    "weight": "part_weight_grams",
                    "dist": "distance_miles",
                    "ship": "shipping_weight_lbs",
                    "tier": "seller_tier",
                    "method": "delivery_method",
                    "pass": "has_build_pass",
                    "qty": "quantity",
                }
                field = shortcuts.get(k, k)
                if field in ("seller_tier", "delivery_method"):
                    setattr(inp, field, v)
                elif field == "has_build_pass":
                    setattr(inp, field, v.lower() in ("true", "yes", "1"))
                elif field == "quantity":
                    setattr(inp, field, int(v))
                else:
                    setattr(inp, field, float(v))
        result = calculate_price(inp)
        print_breakdown(inp, result)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
