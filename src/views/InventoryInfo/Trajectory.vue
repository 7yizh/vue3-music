<template>
  <div class="user-management">
    <div class="management_1">
      <el-page-header @back="Back">
        <template #content>
          <div class="flex items-center">
            <span class="text-large font-600 mr-3">轨迹信息</span>
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button type="primary" class="ml-2" @click="handleRefresh" icon="RefreshLeft">刷新</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="main_2">
      <baidu-map class="map" :center="mapCenter" :zoom="mapZoom" :key="mapKey" @ready="onMapReady"></baidu-map>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

// 存储经纬度数组
const longitudes = ref([]);
const latitudes = ref([]);
const bagitudes = ref([]);

// 地图中心点（根据数据动态计算）
const mapCenter = ref({ lng: 117.2, lat: 39.13 });
const mapZoom = ref(12);
const mapKey = ref(0);

// 存储地图实例
const mapInstance = ref(null);
const BMapInstance = ref(null);

onMounted(() => {
  // 从路由参数获取经纬度数组
  getDataFromRoute();
});

// 从路由参数获取数据
const getDataFromRoute = () => {
  try {
    const { longitudes: lngStr, latitudes: latStr, bagitudes: bagStr } = route.query;
    
    if (lngStr && latStr) {
      longitudes.value = JSON.parse(lngStr);
      latitudes.value = JSON.parse(latStr);
      bagitudes.value = JSON.parse(bagStr);

      console.log('接收到的经纬度数据：', longitudes.value, latitudes.value,bagitudes.value);
      
      // 如果有数据，计算中心点
      if (longitudes.value.length > 0 && latitudes.value.length > 0) {
        calculateCenter();
      }
    } else {
      console.warn('未接收到经纬度数据');
    }
  } catch (error) {
    console.error('解析数据失败:', error);
    ElMessage.error('数据格式错误');
  }
};

// 计算地图中心点
const calculateCenter = () => {
  if (longitudes.value.length === 0 || latitudes.value.length === 0) return;
  
  const sumLng = longitudes.value.reduce((a, b) => a + b, 0);
  const sumLat = latitudes.value.reduce((a, b) => a + b, 0);
  
  const avgLng = sumLng / longitudes.value.length;
  const avgLat = sumLat / latitudes.value.length;
  
  mapCenter.value = { lng: avgLng, lat: avgLat };
  
  // 根据数据范围调整缩放级别
  if (longitudes.value.length === 1) {
    mapZoom.value = 15;
  }
};

const onMapReady = ({ BMap, map }) => {
  BMapInstance.value = BMap;
  mapInstance.value = map;
  
  // 如果有数据，创建标注点
  if (longitudes.value.length > 0 && latitudes.value.length > 0) {
    addMarkers();
  }
};

const Back = () => {
  router.push('/home/inventotry');
};

// 动态创建标注点
const addMarkers = () => {
  if (!mapInstance.value || !BMapInstance.value) return;
  
  const { BMap, map } = {
    BMap: BMapInstance.value,
    map: mapInstance.value
  };
  
  // 清除现有的覆盖物
  map.clearOverlays();
  
  // 确保两个数组长度相同
  const pointCount = Math.min(longitudes.value.length, latitudes.value.length);
  
  // 创建图标
  const icon = new BMap.Icon(
    'https://api.map.baidu.com/images/marker_red.png',
    new BMap.Size(40, 40)
  );
  
  // 遍历数组创建标注点
  for (let i = 0; i < pointCount; i++) {
    const lng = longitudes.value[i];
    const lat = latitudes.value[i];
    
    // 创建坐标点
    const point = new BMap.Point(lng, lat);
    
    // 创建标注点
    const marker = new BMap.Marker(point, { icon });
    
    // 添加到地图
    map.addOverlay(marker);
    
    // 创建信息窗口
    const infoContent = `位置 ${bagitudes.value[i]}<br/>经度: ${lng.toFixed(6)}<br/>纬度: ${lat.toFixed(6)}`;
    const infoWindow = new BMap.InfoWindow(infoContent);
    
    // 添加点击事件
    marker.addEventListener('click', () => {
      map.openInfoWindow(infoWindow, point);
    });
  }
  
  console.log(`成功创建 ${pointCount} 个标注点`);
};

// 刷新
const handleRefresh = () => {
  // 重新获取数据
  getDataFromRoute();
  
  // 强制重绘地图
  mapKey.value += 1;
};
</script>

<style scoped>
.user-management {
  padding-left: 20px;
  padding-bottom: 20px;
}

.management_1 {
  margin-bottom: 15px;
}

.main_2 {
  height: 750px;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>