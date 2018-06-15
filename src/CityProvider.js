import CityData from './CityData';

const CityGeneratedData = generateData(CityData);

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

export function getProvinces() {
    return CityGeneratedData;
}

export function getCityInProvince(province) {
    return CityGeneratedData[province.name]['citys'];
}

export function getDistrictInCity(province, city) {
    return CityGeneratedData[province.name]['citys'][city.name]['districts'];
}