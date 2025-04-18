
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBugById, updateBug, addComment, currentUser } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BugStatus } from '@/types/bug';
import StatusBadge from '@/components/ui/status-badge';
import SeverityBadge from '@/components/ui/severity-badge';
import { ArrowLeft, Edit, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BugDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bug = getBugById(id!);
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState(bug?.status);
  
  if (!bug) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Bug Not Found</h2>
        <p className="text-gray-500 mt-2">The bug you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => navigate('/bugs')}
          className="mt-4"
          variant="outline"
        >
          Back to Bug List
        </Button>
      </div>
    );
  }
  
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    addComment(bug.id, currentUser.id, currentUser.name, commentText);
    setCommentText('');
    toast.success('Comment added successfully.');
  };
  
  const handleStatusChange = (newStatus: BugStatus) => {
    setStatus(newStatus);
    updateBug(bug.id, { status: newStatus });
    toast.success(`Bug status updated to ${newStatus}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{bug.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Reported by {bug.reportedBy}</span>
              <span>•</span>
              <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={status} onValueChange={(val) => handleStatusChange(val as BugStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={bug.status} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BugStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex gap-2 items-center">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{bug.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-xl font-semibold">Steps to Reproduce</h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{bug.stepsToReproduce}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Comments</h2>
                <Badge variant="outline" className="text-gray-500">
                  {bug.comments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {bug.comments.length > 0 ? (
                  bug.comments.map(comment => (
                    <div key={comment.id} className="p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{comment.userName}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No comments yet.</p>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Add Comment</h3>
                <Textarea 
                  placeholder="Write your comment..." 
                  className="mb-2" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold">Bug Details</h2>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1"><StatusBadge status={bug.status} /></dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Severity</dt>
                  <dd className="mt-1"><SeverityBadge severity={bug.severity} /></dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                  <dd className="mt-1">{bug.assignedTo || '—'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Game Area</dt>
                  <dd className="mt-1">{bug.gameArea}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Platform</dt>
                  <dd className="mt-1">{bug.platform}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1">{new Date(bug.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1">{new Date(bug.updatedAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold">Activity</h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="text-sm">Bug reported by <span className="font-medium">{bug.reportedBy}</span></p>
                    <p className="text-xs text-gray-500">{new Date(bug.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="text-sm">Status changed to <span className="font-medium">{bug.status}</span></p>
                    <p className="text-xs text-gray-500">{new Date(bug.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                {bug.assignedTo && (
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm">Assigned to <span className="font-medium">{bug.assignedTo}</span></p>
                      <p className="text-xs text-gray-500">{new Date(bug.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {bug.comments.length > 0 && (
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm"><span className="font-medium">{bug.comments.length}</span> comments added</p>
                      <p className="text-xs text-gray-500">{new Date(bug.comments[bug.comments.length - 1].createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BugDetail;
