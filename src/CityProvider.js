import CityData from './CityData';

const CityGeneratedData = generateData(CityData);
export const CityPickListData = parseDataForPickList(CityData);

function generateData(originData) {
    const result = {};
    originData.forEach(province => {
        const province_id = province['id'];
        const province_name = province['name'];
        const citys = province[province_name];
        const city_result = {};
        citys.forEach(city => {
            const city_id = city['id'];
            const city_name = city['name'];
            const districts = city[city_name];
            city_result[city_name] = {
                id: city_id,
                name: city_name,
                districts: districts,
            };
        });
        result[province_name] = {
            id: province_id,
            name: province_name,
            citys: city_result,
        };
    });
    return result;
}

export function parseDataForPickList(originData) {
    const result = {
        tree: [],
        label: '选择定位',
    };
    originData.forEach((province) => {
        const province_id = province['id'];
        const province_name = province['name'];
        const citys = province[province_name];
        const city_result = [];
        citys.forEach((city) => {
            const city_id = city['id'];
            const city_name = city['name'];
            const districts = city[city_name];
            const district_result = [];
            districts.forEach((district) => {
                district_result.push({
                    seq: district['id'],
                    id: district['id'],
                    label: district['name'],
                    parentId: city_id,
                });
            });
            city_result.push({
                seq: city_id,
                id: city_id,
                label: city_name,
                children: district_result,
                parentId: province_id,
            });
        });
        result.tree.push({
            seq: province_id,
            id: province_id,
            label: province_name,
            children: city_result,
        });
    });
    return result;
}

export function getProvinces() {
    return CityGeneratedData;
}

export function getCityInProvince(province) {
    return CityGeneratedData[province.name]['citys'];
}

export function getDistrictInCity(province, city) {
    return CityGeneratedData[province.name]['citys'][city.name]['districts'];
}