import dbConnect from "./src/lib/db/connection";
import { Order } from "./src/lib/db/models/Order";
import { Product } from "./src/lib/db/models/Product";

async function inspect() {
  try {
    await dbConnect();
    
    const order = await Order.findOne({ items: { $exists: true, $not: { $size: 0 } } }).lean();
    
    
    const product = await Product.findOne().lean();
    
    
    const activeProductsCount = await Product.countDocuments({ status: { $ne: "archived" } });
    
    
    const productsByStatus = await Product.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

inspect();
