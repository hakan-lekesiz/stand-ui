import { ICurrentPage, initialICurrentPage } from '../models/ICurrentPage';
import { initStore } from './store';

const configureStore = () => {
    const actions = {
        SET_CURRENT_PAGE: (curState: any, curPage: ICurrentPage) => {

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.currentPage = curPage;

            return { globals: updatedGlobals };

        },
        SET_UPDATE: (curState: any) => {

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.update = updatedGlobals.update + 1;

            return { globals: updatedGlobals };

        },

        GET_USER_TYPES: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.getAllUserTypes)
            const resData = await result.json();

            let userTypes: any[] = [];
            resData.map((item: any) => (
                userTypes.push({
                    id: item.id.toString(),
                    name: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.userTypes = userTypes;

            return { globals: updatedGlobals };

        },

        GET_USER_ROLES: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.getAllUserRoles)
            const resData = await result.json();

            let userRoles: any[] = [];
            resData.map((item: any) => (
                userRoles.push({
                    id: item.id.toString(),
                    name: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.userRoles = userRoles;

            return { globals: updatedGlobals };

        },

        GET_CONSULTANT: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.consultantOptions)
            const resData = await result.json();

            let consultantOptions: any[] = [];
            resData.map((item: any) => (
                consultantOptions.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.consultantOptions = consultantOptions;

            return { globals: updatedGlobals };

        },

        GET_LOCATION_TYPES: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.locationTypes)
            const resData = await result.json();

            let locationTypes: any[] = [];
            resData.map((item: any) => (
                locationTypes.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.locationTypes = locationTypes;

            return { globals: updatedGlobals };

        },

        GET_CITIES: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.getCities)
            const resData = await result.json();

            let cities: any[] = [];
            resData.map((item: any) => (
                cities.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.cities = cities;

            return { globals: updatedGlobals };

        },

        GET_SEMINAR_STATUS_OPTIONS: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.seminarStatusOptions)
            const resData = await result.json();

            let seminarStatusOptions: any[] = [];
            resData.map((item: any) => (
                seminarStatusOptions.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.seminarStatusOptions = seminarStatusOptions;

            return { globals: updatedGlobals };

        },

        GET_SEMINAR_SUBJECT_OPTIONS: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.seminarSubjectOptions)
            const resData = await result.json();

            let seminarSubjectOptions: any[] = [];
            resData.map((item: any) => (
                seminarSubjectOptions.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.seminarSubjectOptions = seminarSubjectOptions;

            return { globals: updatedGlobals };

        },

        GET_ACCREDITATIONS: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.accreditationOption)
            const resData = await result.json();

            let accreditationOption: any[] = [];
            resData.map((item: any) => (
                accreditationOption.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.accreditationOption = accreditationOption;

            return { globals: updatedGlobals };

        },

        GET_STANDARTS: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.standartOption)
            const resData = await result.json();

            let standartOption: any[] = [];
            resData.map((item: any) => (
                standartOption.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.standartOption = standartOption;

            return { globals: updatedGlobals };

        },

        GET_FILE_TYPES: async (curState: any) => {

            const result: any = await fetch(curState.globals.routes.fileTypeOption)
            const resData = await result.json();

            let fileTypeOption: any[] = [];
            resData.map((item: any) => (
                fileTypeOption.push({
                    id: item.id.toString(),
                    title: item.name
                })
            ));

            const updatedGlobals: any = { ...curState.globals };
            updatedGlobals.formDatas.fileTypeOption = fileTypeOption;

            return { globals: updatedGlobals };

        },

    };

    initStore(actions, {
        globals: {
            routes: {
                login: "/api/v1/user/login",
                forgotPassword: "/api/v1/user/forgot-password",
                resetPassword: "/api/v1/user/reset-password",
                users: "/api/v1/user",
                roles: "/api/v1/user/role",
                permission: "/api/v1/user/permission",
                getAllUserRoles: "/api/v1/user/role",
                getAllUserTypes: "/api/v1/user/type",
                clients: "/api/v1/client",
                consultantOptions: "/api/v1/field/consultant/option",
                accreditationOption: "/api/v1/field/accreditation/option",
                standartOption: "/api/v1/field/standart/option",
                fileTypeOption: "/api/v1/field/file_type/option",
                file: "/api/v1/file",
                seminarStatusOptions: "/api/v1/field/seminar_status/option",
                seminarSubjectOptions: "/api/v1/field/seminar_subject/option",
                location: "/api/v1/location",
                educations: "/api/v1/seminar",
                locationTypes: "/api/v1/field/location_type/option",
                getCities: "/api/v1/city",
                getDistricts: "/api/v1/city/:id/district",
                procedures: "/api/v1/procedure-definition",
                revisions: "/api/v1/revision",
                note: "/api/v1/note",
                info: "/api/v1/info",

            },
            urls: {
                clients: "/musteriler",
                login: "/giris-yap",
                forgotPassword: "/sifremi-unuttum",
                resetPassword: "/sifremi-yenile",
                users: "/yetkililer",
                userCreate: "/yetkili-ekle",
                userEdit: "/yetkili-duzenle/:id",
                userView: "/yetkili-detay/:id",
                roles: "/roller",
                roleCreate: "/rol-ekle",
                roleEdit: "/rol-duzenle/:id",
                roleView: "/rol-detay/:id",
                clientCreate: "/musteri-ekle",
                clientEdit: "/musteri-duzenle/:id",
                clientView: "/musteri-detay/:id",
                clientLocations: "/musteri-lokasyon/:id",
                clientFolders: "/musteri-dosyalari/:id",
                clientNotes: "/musteri-notlari/:id",
                educations: "/egitimler",
                educationCreate: "/egitim-ekle",
                educationEdit: "/egitim-duzenle/:id",
                educationView: "/egitim-detay/:id",
                educationFolders: "/egitim-dosyalari/:id",
                educationNotes: "/egitim-notlari/:id",
                procedures: "/procedure-islemleri",
                procedureCreate: "/procedure-islemleri-ekle",
                procedureEdit: "/procedure-islemleri-duzenle/:id",
                procedureView: "/procedure-islemleri-detay/:id",
                files: "/dosyalar",
                notes: "/notlar",
            },
            validationMessages: {
                email: "Lütfen doğru formatta bir e-posta giriniz.",
                required: "Gerekli alan."
            },
            formDatas: {
                userRoles: [],
                userTypes: [],
                consultantOptions: [],
                accreditationOption: [],
                standartOption: [],
                fileTypeOption: [],
                locationTypes: [],
                cities: [],
                status: [{ id: "0", title: "Silinmiş" }],
                modules: [
                    { id: "client", title: "client" },
                    { id: "procedure", title: "procedure" },
                    { id: "seminar", title: "seminar" },
                    { id: "deal", title: "deal" }
                ],
                noteIsCompletedOptions: [{ id: "null", title: "Not" },{ id: "0", title: "Yapılacak" }, { id: "1", title: "Yapıldı" }],
                seminarStatusOptions: [],
                seminarSubjectOptions: [],
                accountStatusUserAdd: [{ id: "1", name: "Aktif" }, { id: "0", name: "Pasif" }],
            },
            loginExpirationTime: 2 * 3600, //saat cinsinden yazılmalı 2 saat 
            currentPage: initialICurrentPage,
            update: 0,

        }

    });
};

export default configureStore;