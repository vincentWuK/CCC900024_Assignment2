import osmnx as ox
import geopandas as gd


def FindBBox(address):
    bbox = ""
    gdf = ox.geocode_to_gdf(address)
    bbox = bbox + str(float(gdf.boundary.bounds.minx)) + ","
    bbox = bbox + str(float(gdf.boundary.bounds.miny)) + ","
    bbox = bbox + str(float(gdf.boundary.bounds.maxx)) + ","
    bbox = bbox + str(float(gdf.boundary.bounds.maxy))
    return bbox
