export interface HardGoodType {
  _id?: string | { $oid: string };
  sku?: string | number;
  attributeSetId?: string;
  brandId?: string;
  description?: string;
  category?: string;
  mrp?: string | number;
  gst?: string | number;
  stock_88?: string | number;
  product_type?: string;
  product_model?: string;
  orientation?: string;
  createdAt?: string;
  metaData?: {
    section: string;
  };
}
