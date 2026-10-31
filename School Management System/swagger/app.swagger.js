/**
 * @openapi
 * /:
 *   get:
 *     summary: Retrieve the home page status
 *     description: Returns a basic success status message confirming the root route is accessible.
 *     tags : 
 *       - Home
 *     responses:
 *       200:
 *         description: Success response containing the greeting message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: This is home page.
 */