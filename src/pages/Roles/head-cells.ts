import { HeadCell } from "../../models/HeadCell";

export const headCells: HeadCell[] = [
    {
      id: "created_at",
      label: "Tarih",
      align:"left",
      sort:true
    },
    {
      id: "name",
      label: "Rol Adı",
      align:"left",
      sort:false
    },
    {
      id: "user_type", //
      label: "Kullanıcı Tipi",
      align:"left",
      sort:false
    },
    {
      id: "accountStatus",
      label: "Durumu",
      align:"left",
      sort:false
    },
  ];
