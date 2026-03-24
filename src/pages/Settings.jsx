import { useState } from 'react';
import { useSchoolConfig, DEFAULT_CONFIG } from '../contexts/SchoolConfigContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Plus, Trash2, Pencil, RotateCcw, Save, AlertTriangle, GraduationCap, BookOpen, Calendar } from 'lucide-react';

export default function Settings() {
  const {
    gradeLevels, sections, subjects, quarters, schoolYear,
    updateConfig, resetToDefaults,
  } = useSchoolConfig();

  const [tab, setTab] = useState('grades');

  // --- Grade Levels state ---
  const [newGrade, setNewGrade] = useState('');
  const [editGradeIdx, setEditGradeIdx] = useState(null);
  const [editGradeValue, setEditGradeValue] = useState('');

  // --- Sections state ---
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionGrade, setNewSectionGrade] = useState('');
  const [editSectionIdx, setEditSectionIdx] = useState(null);
  const [editSectionName, setEditSectionName] = useState('');
  const [editSectionGrade, setEditSectionGrade] = useState('');

  // --- Subjects state ---
  const [newSubject, setNewSubject] = useState('');
  const [editSubjectIdx, setEditSubjectIdx] = useState(null);
  const [editSubjectValue, setEditSubjectValue] = useState('');

  // --- School year state ---
  const [yearInput, setYearInput] = useState(schoolYear);

  // --- Quarters state ---
  const [editQuarterIdx, setEditQuarterIdx] = useState(null);
  const [editQuarterValue, setEditQuarterValue] = useState('');

  // --- Reset dialog ---
  const [showResetDialog, setShowResetDialog] = useState(false);

  // ========== GRADE LEVELS ==========
  const addGrade = () => {
    const v = newGrade.trim();
    if (!v || gradeLevels.includes(v)) return;
    updateConfig({ gradeLevels: [...gradeLevels, v] });
    setNewGrade('');
  };

  const saveEditGrade = () => {
    const v = editGradeValue.trim();
    if (!v || (v !== gradeLevels[editGradeIdx] && gradeLevels.includes(v))) return;
    const oldName = gradeLevels[editGradeIdx];
    const updated = gradeLevels.map((g, i) => (i === editGradeIdx ? v : g));
    // also update sections referencing old grade name
    const updatedSections = sections.map((s) =>
      s.gradeLevel === oldName ? { ...s, gradeLevel: v } : s,
    );
    updateConfig({ gradeLevels: updated, sections: updatedSections });
    setEditGradeIdx(null);
  };

  const deleteGrade = (idx) => {
    const name = gradeLevels[idx];
    if (sections.some((s) => s.gradeLevel === name)) return; // prevent if referenced
    updateConfig({ gradeLevels: gradeLevels.filter((_, i) => i !== idx) });
  };

  const gradeHasSections = (name) => sections.some((s) => s.gradeLevel === name);

  // ========== SECTIONS ==========
  const addSection = () => {
    const name = newSectionName.trim();
    if (!name || !newSectionGrade || sections.some((s) => s.name === name)) return;
    updateConfig({ sections: [...sections, { name, gradeLevel: newSectionGrade }] });
    setNewSectionName('');
    setNewSectionGrade('');
  };

  const saveEditSection = () => {
    const name = editSectionName.trim();
    if (!name || !editSectionGrade) return;
    if (name !== sections[editSectionIdx].name && sections.some((s) => s.name === name)) return;
    const updated = sections.map((s, i) =>
      i === editSectionIdx ? { name, gradeLevel: editSectionGrade } : s,
    );
    updateConfig({ sections: updated });
    setEditSectionIdx(null);
  };

  const deleteSection = (idx) => {
    updateConfig({ sections: sections.filter((_, i) => i !== idx) });
  };

  // ========== SUBJECTS ==========
  const addSubject = () => {
    const v = newSubject.trim();
    if (!v || subjects.includes(v)) return;
    updateConfig({ subjects: [...subjects, v] });
    setNewSubject('');
  };

  const saveEditSubject = () => {
    const v = editSubjectValue.trim();
    if (!v || (v !== subjects[editSubjectIdx] && subjects.includes(v))) return;
    updateConfig({ subjects: subjects.map((s, i) => (i === editSubjectIdx ? v : s)) });
    setEditSubjectIdx(null);
  };

  const deleteSubject = (idx) => {
    updateConfig({ subjects: subjects.filter((_, i) => i !== idx) });
  };

  // ========== SCHOOL YEAR ==========
  const saveYear = () => {
    const v = yearInput.trim();
    if (/^\d{4}-\d{4}$/.test(v)) {
      updateConfig({ schoolYear: v });
    }
  };

  // ========== QUARTERS ==========
  const saveEditQuarter = () => {
    const v = editQuarterValue.trim();
    if (!v) return;
    updateConfig({ quarters: quarters.map((q, i) => (i === editQuarterIdx ? v : q)) });
    setEditQuarterIdx(null);
  };

  // ========== RESET ==========
  const handleReset = () => {
    resetToDefaults();
    setYearInput(DEFAULT_CONFIG.schoolYear);
    setShowResetDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage academic configuration for the school</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)} className="text-red-600 border-red-200 hover:bg-red-50">
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="grades"><GraduationCap className="h-4 w-4 mr-1.5" />Grade Levels & Sections</TabsTrigger>
          <TabsTrigger value="subjects"><BookOpen className="h-4 w-4 mr-1.5" />Subjects</TabsTrigger>
          <TabsTrigger value="year"><Calendar className="h-4 w-4 mr-1.5" />School Year & Quarters</TabsTrigger>
        </TabsList>

        {/* ==================== TAB 1: GRADE LEVELS & SECTIONS ==================== */}
        <TabsContent value="grades">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Levels */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Grade Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Grade 11"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGrade()}
                  />
                  <Button size="sm" onClick={addGrade} disabled={!newGrade.trim()}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade Level</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradeLevels.map((g, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {editGradeIdx === idx ? (
                            <Input
                              value={editGradeValue}
                              onChange={(e) => setEditGradeValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditGrade()}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              {g}
                              {gradeHasSections(g) && <Badge variant="secondary" className="text-[10px]">has sections</Badge>}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editGradeIdx === idx ? (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEditGrade}><Save className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditGradeIdx(null)}>✕</Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditGradeIdx(idx); setEditGradeValue(g); }}><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => deleteGrade(idx)} disabled={gradeHasSections(g)} title={gradeHasSections(g) ? 'Remove sections first' : 'Delete'}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {gradeLevels.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">No grade levels</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Section name"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newSectionGrade} onChange={(e) => setNewSectionGrade(e.target.value)} className="flex-1">
                    <option value="">Grade level…</option>
                    {gradeLevels.map((g) => <option key={g} value={g}>{g}</option>)}
                  </Select>
                  <Button size="sm" onClick={addSection} disabled={!newSectionName.trim() || !newSectionGrade}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Grade Level</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((s, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {editSectionIdx === idx ? (
                            <Input value={editSectionName} onChange={(e) => setEditSectionName(e.target.value)} autoFocus />
                          ) : s.name}
                        </TableCell>
                        <TableCell>
                          {editSectionIdx === idx ? (
                            <Select value={editSectionGrade} onChange={(e) => setEditSectionGrade(e.target.value)}>
                              {gradeLevels.map((g) => <option key={g} value={g}>{g}</option>)}
                            </Select>
                          ) : (
                            <Badge variant="outline">{s.gradeLevel}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editSectionIdx === idx ? (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEditSection}><Save className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditSectionIdx(null)}>✕</Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditSectionIdx(idx); setEditSectionName(s.name); setEditSectionGrade(s.gradeLevel); }}><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => deleteSection(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {sections.length === 0 && (
                      <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No sections</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== TAB 2: SUBJECTS ==================== */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Subjects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="e.g. Computer Science"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                />
                <Button size="sm" onClick={addSubject} disabled={!newSubject.trim()}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-muted-foreground w-10">{idx + 1}</TableCell>
                      <TableCell>
                        {editSubjectIdx === idx ? (
                          <Input
                            value={editSubjectValue}
                            onChange={(e) => setEditSubjectValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEditSubject()}
                            autoFocus
                          />
                        ) : s}
                      </TableCell>
                      <TableCell className="text-right">
                        {editSubjectIdx === idx ? (
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEditSubject}><Save className="h-3.5 w-3.5" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditSubjectIdx(null)}>✕</Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditSubjectIdx(idx); setEditSubjectValue(s); }}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => deleteSubject(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {subjects.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No subjects</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 3: SCHOOL YEAR & QUARTERS ==================== */}
        <TabsContent value="year">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">School Year</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 max-w-xs">
                  <Input
                    placeholder="YYYY-YYYY"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveYear()}
                  />
                  <Button size="sm" onClick={saveYear} disabled={!/^\d{4}-\d{4}$/.test(yearInput.trim())}>
                    <Save className="h-4 w-4 mr-1" />Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: <span className="font-medium text-foreground">{schoolYear}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quarters</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarters.map((q, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-muted-foreground w-10">{idx + 1}</TableCell>
                        <TableCell>
                          {editQuarterIdx === idx ? (
                            <Input
                              value={editQuarterValue}
                              onChange={(e) => setEditQuarterValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditQuarter()}
                              autoFocus
                            />
                          ) : q}
                        </TableCell>
                        <TableCell className="text-right">
                          {editQuarterIdx === idx ? (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEditQuarter}><Save className="h-3.5 w-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditQuarterIdx(null)}>✕</Button>
                            </div>
                          ) : (
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditQuarterIdx(idx); setEditQuarterValue(q); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Reset to Defaults
            </DialogTitle>
            <DialogDescription>
              This will restore all settings to their original values. Any custom grade levels, sections, subjects, and school year changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReset}>Reset Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
