import { getUsersByRole } from "./src/lib/actions/users";
import dbConnect from "./src/lib/db/connection";

async function test() {
  await dbConnect();
  const roles = ["manager", "sales_rep", "retailer"];
  for (const role of roles) {
    const users = await getUsersByRole(role);
    console.log(`Role: ${role}, Count: ${users.length}`);
    if (users.length > 0) {
      console.log(`Example user:`, users[0]);
    }
  }
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
