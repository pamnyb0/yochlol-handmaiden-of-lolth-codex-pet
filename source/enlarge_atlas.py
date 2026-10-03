"""Enlarge the approved poses within their existing 192x208 cells.

Each animation row receives one shared scale. Every frame keeps its own
ground contact and lower-body anchor, so the idle stays planted.
"""
import json
import sys
from pathlib import Path
from PIL import Image

sys.path.insert(0, 'C:/Users/pamig/.codex/plugins/cache/openai-curated-remote/work-pets/0.1.6/skills/create-pet/scripts')
from assemble_extended_atlas import CellGeometry, cell_geometry, normalize_cell_to_geometry

root = Path(__file__).resolve().parents[1]
source_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'spritesheet.png'
source = Image.open(source_path).convert('RGBA')
output = Image.new('RGBA', source.size, (0, 0, 0, 0))
states = [(0,6),(1,8),(2,8),(3,4),(4,5),(5,8),(6,6),(7,6),(8,6),(9,8),(10,8)]
report = {'source':str(source_path), 'desired_scale':1.42, 'rows':[]}

for row, count in states:
    cells = [source.crop((col*192,row*208,(col+1)*192,(row+1)*208)) for col in range(count)]
    if row == 3:
        # Hover maps to waving. Use the restrained rise-and-settle frames and
        # omit the broad lateral reach that forced this state much smaller.
        cells = [cells[0], cells[1], cells[3], cells[0]]
    boxes = [cell.getchannel('A').getbbox() for cell in cells]
    boxes = [box for box in boxes if box]
    # Preserve six clear pixels around each complete pose.
    before_boxes = [cell.getchannel('A').getbbox() for cell in cells]
    limits = [1.42]
    for cell, box in zip(cells, before_boxes):
        geom = cell_geometry(cell)
        left, top, right, bottom = box
        pivot = geom.lower_center_x
        if pivot > left:
            limits.append((pivot-7)/(pivot-left))
        if right > pivot:
            limits.append((185-pivot)/(right-pivot))
        limits.append((geom.bottom-7)/(bottom-top))
    scale = min(limits)
    if row == 3:
        scale = 1.36
    candidates = []
    for cell in cells:
        geom = cell_geometry(cell)
        candidates.append(normalize_cell_to_geometry(
            cell, CellGeometry(geom.height, geom.lower_center_x, geom.bottom + 9), scale))
    after_boxes = [cell.getchannel('A').getbbox() for cell in candidates]
    if not all(box and box[0] >= 6 and box[2] <= 186 and box[1] >= 6 and box[3] <= 202 for box in after_boxes):
        raise ValueError(f'unsafe margin at row {row}: {after_boxes}')
    row_result = {'row':row, 'frames':count, 'scale':round(scale,4), 'before_bounds':[], 'after_bounds':[]}
    for col, (enlarged, before_box, box) in enumerate(zip(candidates, before_boxes, after_boxes)):
        output.alpha_composite(enlarged, (col*192,row*208))
        row_result['before_bounds'].append(before_box)
        row_result['after_bounds'].append(box)
    report['rows'].append(row_result)

# The Codex hover mapping uses the jumping row. Give it the same visual scale
# and ground anchor as the idle; animate the upper pseudopods instead of
# lifting the entire body. A quick rise and return makes the state distinct.
wave_cells = [output.crop((col*192,3*208,(col+1)*192,4*208)) for col in range(4)]
rear_sequence = [wave_cells[0], wave_cells[1], wave_cells[2], wave_cells[1], wave_cells[0]]
for col, cell in enumerate(rear_sequence):
    output.alpha_composite(cell, (col*192,4*208))
report['rooted_hover_reaction'] = {
    'source_row':3, 'target_row':4, 'sequence':'rest-rise-rear-return-rest',
    'shared_scale':1.36, 'ground_baseline':192,
    'frame_bounds':[cell.getchannel('A').getbbox() for cell in rear_sequence],
    'whole_body_vertical_translation':False
}
report['rows'][4]['scale'] = 1.36
report['rows'][4]['after_bounds'] = [cell.getchannel('A').getbbox() for cell in rear_sequence]

out_path = root / 'spritesheet.png'
output.save(out_path, optimize=True)
report_path = root / 'source-and-qa' / 'qa' / 'scale-revision.json'
report_path.write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
print(json.dumps({'file':str(out_path),'rows':[(r['row'],r['scale']) for r in report['rows']]}))
