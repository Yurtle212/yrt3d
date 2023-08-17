import bpy


def read_some_data(context, filepath):
    print("running read_some_data...")
    f = open(filepath, 'r', encoding='utf-8')
    data = f.read()
    f.close()

    # would normally load the data here
#    print(data)
    onVerts = True
    
    verts = []
    edges = []
    
    for line in data.split('\n'):
        print(line)
        if (line.strip() == ''):
            onVerts = False
            continue
        
        if onVerts:
            coord = tuple(float(i) for i in line.strip().split(' ')[1:])
            verts.append(coord)
        else:
            edges.append(tuple((int(i[1:]) for i in line.strip().split(' '))))
            
    print(verts)
    print(edges)
            
    me = bpy.data.meshes.new("Mesh")
    ob = bpy.data.objects.new("yrt3dObj", me)
    
    me.from_pydata(verts, edges, [])
    me.update()
    
    bpy.context.collection.objects.link(ob)

    return {'FINISHED'}


# ImportHelper is a helper class, defines filename and
# invoke() function which calls the file selector.
from bpy_extras.io_utils import ImportHelper
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Operator


class ImportSomeData(Operator, ImportHelper):
    """This appears in the tooltip of the operator and in the generated docs"""
    bl_idname = "import_test.some_data"  # important since its how bpy.ops.import_test.some_data is constructed
    bl_label = "Import Some Data"

    # ImportHelper mixin class uses this
    filename_ext = ".yrt3d"

    filter_glob: StringProperty(
        default="*.yrt3d",
        options={'HIDDEN'},
        maxlen=255,  # Max internal buffer length, longer would be clamped.
    )

    def execute(self, context):
        return read_some_data(context, self.filepath)


# Only needed if you want to add into a dynamic menu.
def menu_func_import(self, context):
    self.layout.operator(ImportSomeData.bl_idname, text="Yurtle 3D Import (.yrt3d)")


# Register and add to the "file selector" menu (required to use F3 search "Text Import Operator" for quick access).
def register():
    bpy.utils.register_class(ImportSomeData)
    bpy.types.TOPBAR_MT_file_import.append(menu_func_import)


def unregister():
    bpy.utils.unregister_class(ImportSomeData)
    bpy.types.TOPBAR_MT_file_import.remove(menu_func_import)


if __name__ == "__main__":
    register()

    # test call
    bpy.ops.import_test.some_data('INVOKE_DEFAULT')
