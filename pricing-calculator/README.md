# BuildDash Pricing Calculator

Standalone Python CLI for testing business model variables.

## Usage

```bash
# Interactive mode — prompts for each variable
python calculator.py

# Quick mode — pass variables inline
python calculator.py --quick fab=20 dist=50 tier=pro
python calculator.py --quick fab=30 mat=0.04 weight=100 dist=10 method=local_pickup

# Compare predefined scenarios side by side
python calculator.py --compare

# Batch mode from CSV
python calculator.py --batch scenarios.csv
```

## Quick Mode Shortcuts

| Shortcut | Full Name              | Default | Example       |
|----------|------------------------|---------|---------------|
| `fab`    | fabrication_cost       | 15.00   | `fab=25`      |
| `mat`    | material_cost_per_gram | 0.02    | `mat=0.04`    |
| `weight` | part_weight_grams      | 50.0    | `weight=100`  |
| `dist`   | distance_miles         | 30.0    | `dist=10`     |
| `ship`   | shipping_weight_lbs    | 1.0     | `ship=2.5`    |
| `tier`   | seller_tier            | basic   | `tier=pro`    |
| `method` | delivery_method        | shipping| `method=local_pickup` |
| `pass`   | has_build_pass         | false   | `pass=true`   |
| `qty`    | quantity               | 1       | `qty=5`       |

## CSV Batch Format

```csv
label,fabrication_cost,material_cost_per_gram,part_weight_grams,distance_miles,seller_tier,delivery_method,has_build_pass,quantity
Small PLA part nearby,10,0.02,30,15,basic,shipping,false,1
Large Nylon part far,45,0.04,200,150,pro,shipping,true,1
Local metal pickup,80,0.15,500,5,premium,local_pickup,false,1
```

## What It Shows

For each scenario:
- **Buyer pays**: fabrication + material + platform fee + shipping = total
- **Seller receives**: base earnings + local pickup bonus
- **Platform keeps**: commission + shipping margin
- **Analysis**: markup %, seller take rate, platform take rate
