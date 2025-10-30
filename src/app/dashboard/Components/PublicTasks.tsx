
import { currentUser } from "@clerk/nextjs/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPublicLinksByUserId } from "@/lib/query/getPublicLinks";

export default async function PublicTasks() {
  const user = await currentUser();
  const authId = user?.id;

  if (!authId) {
    return <p className="p-8 text-center text-lg">Please  log in to see your public tasks.</p>;
  }

  // Fetch public links for current user
  const publicLinks = await getPublicLinksByUserId(authId);

  if (publicLinks.length === 0) {
    return <p className="text-gray-500 italic">No public links created yet!</p>;
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow className="hover:bg-gray-50">
          <TableHead className="w-[30%] text-indigo-700">Task Title</TableHead>
          <TableHead className="w-[40%] text-indigo-700">Public Link</TableHead>
          <TableHead className="w-[20%] text-indigo-700 text-center">Created At</TableHead>
          <TableHead className="w-[10%] text-indigo-700 text-center">Expires At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicLinks.map((link) => (
          <TableRow key={link.token}>
            <TableCell className="font-medium">{link.taskTitle || '—'}</TableCell>
            <TableCell className="text-sm text-blue-600 max-w-xs truncate">
              <a href={`/public/${link.token}`} target="_blank" rel="noopener noreferrer">
                {`${link.token}`}
              </a>
            </TableCell>
            <TableCell className="text-center">{new Date(link.createdAt).toLocaleString()}</TableCell>
            <TableCell className="text-center">
              {new Date(link.expiresAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
