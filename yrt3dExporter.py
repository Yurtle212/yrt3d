import bpy
from bpy import context

# Blender Exporter for YRT3D files

def write_some_data(context, filepath):
    print("running write_some_data...")
    
    obj = context.active_object

    finalStr = ""

    for i in range(len(obj.data.vertices)):
        v = obj.data.vertices[i]
        finalStr += ("v%d" % i) 
        for j in range(len(obj.matrix_world @ v.co)):
            finalStr += ' ' + str((obj.matrix_world @ v.co)[j])
        finalStr += ("\n") 
            
        
    for i in range(len(obj.data.edges)):
        e = obj.data.edges[i]
        
        finalStr += "\n"
        
        for j in range(len(e.vertices)):
            finalStr += 'v' + str(e.vertices[j]) + ' '
    
    f = open(filepath, 'w', encoding='utf-8')
    f.write(finalStr)
    f.close()

    return {'FINISHED'}


# ExportHelper is a helper class, defines filename and
# invoke() function which calls the file selector.
from bpy_extras.io_utils import ExportHelper
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Operator


class ExportSomeData(Operator, ExportHelper):
    """This appears in the tooltip of the operator and in the generated docs"""
    bl_idname = "export_test.some_data"  # important since its how bpy.ops.import_test.some_data is constructed
    bl_label = "Export Some Data"

    # ExportHelper mixin class uses this
    filename_ext = ".yrt3d"

    filter_glob: StringProperty(
        default="*.yrt3d",
        options={'HIDDEN'},
        maxlen=255,  # Max internal buffer length, longer would be clamped.
    )

    def execute(self, context):
        return write_some_data(context, self.filepath)


# Only needed if you want to add into a dynamic menu
def menu_func_export(self, context):
    self.layout.operator(ExportSomeData.bl_idname, text="Text Export Operator")

# Register and add to the "file selector" menu (required to use F3 search "Text Export Operator" for quick access)
def register():
    bpy.utils.register_class(ExportSomeData)
    bpy.types.TOPBAR_MT_file_export.append(menu_func_export)


def unregister():
    bpy.utils.unregister_class(ExportSomeData)
    bpy.types.TOPBAR_MT_file_export.remove(menu_func_export)


if __name__ == "__main__":
    register()

    # test call
    bpy.ops.export_test.some_data('INVOKE_DEFAULT')
