import request from "@/utils/request";

//品牌列表的每一项的类型 / 新增品牌请求体类型
export interface trademarkItemType {
  id?: number;
  tmName: string;
  logoUrl: string;
}
// 品牌列表的类型
export type trademarkListType = trademarkItemType[];
// 请求分页列表返回值类型
export interface trademarkInfoType {
  records: trademarkListType;
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
// 1.获取品牌信息列表
// GET /admin/product/baseTrademark/{page}/{limit}
// 分页列表
export const reqTrademarkInfo = (page: number, limit: number) => {
  return request.get<null, trademarkInfoType>(
    `/admin/product/baseTrademark/${page}/${limit}`
  );
};

// 2.新增品牌
// POST /admin/product/baseTrademark/save
// 新增BaseTrademark
export const reqAddTrademark = (tmInfo: trademarkItemType) => {
  return request.post<null, null>(`/admin/product/baseTrademark/save`, tmInfo);
};

// 3.修改品牌
// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark
export const reqEditTrademark = (tmInfo: trademarkItemType) => {
  return request.put<null, null>(`/admin/product/baseTrademark/update`, tmInfo);
};
